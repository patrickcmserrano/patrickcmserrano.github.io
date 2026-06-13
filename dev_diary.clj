#!/usr/bin/env bb
(ns dev-diary
  (:require [babashka.http-client :as http]
            [cheshire.core :as json]
            [clojure.string :as str]
            [clojure.java.io :as io])
  (:import [java.time Instant Duration]
           [java.time.format DateTimeFormatter]
           [java.util Date]))

(def username "patrickcmserrano")

;; Carrega tokens do ambiente
(def gh-token (or (System/getenv "GH_PAT") (System/getenv "GITHUB_TOKEN")))
(def anthropic-key (System/getenv "ANTHROPIC_API_KEY"))

(defn github-headers []
  (if (seq gh-token)
    {"Authorization" (str "token " gh-token)
     "Accept" "application/vnd.github.v3+json"}
    {"Accept" "application/vnd.github.v3+json"}))

(defn get-repositories []
  (println "Buscando repositórios públicos de" username "...")
  (try
    (let [url (str "https://api.github.com/users/" username "/repos?per_page=100")
          response (http/get url {:headers (github-headers)})]
      (if (= (:status response) 200)
        (json/parse-string (:body response) true)
        (do
          (println "Erro ao buscar repositórios. Status:" (:status response))
          [])))
    (catch Exception e
      (println "Erro de conexão ao buscar repositórios:" (.getMessage e))
      [])))

(defn get-recent-commits [repo-name since-str]
  (let [url (str "https://api.github.com/repos/" username "/" repo-name "/commits?since=" since-str "&author=" username)
        _ (println "Buscando commits para" repo-name "desde" since-str "...")]
    (try
      (let [response (http/get url {:headers (github-headers)})]
        (if (= (:status response) 200)
          (json/parse-string (:body response) true)
          []))
      (catch Exception e
        (println "Erro ao buscar commits para" repo-name ":" (.getMessage e))
        []))))

(defn format-commits-prompt [repos-with-commits]
  (str/join "\n\n"
            (for [[repo commits] repos-with-commits]
              (str "Repositório: " repo "\n"
                   (str/join "\n"
                             (for [c commits]
                               (let [msg (get-in c [:commit :message])
                                     date (get-in c [:commit :author :date])]
                                 (str "- [" date "] " (first (str/split-lines msg))))))))))

(defn call-claude-api [prompt]
  (if-not (seq anthropic-key)
    (throw (Exception. "Chave ANTHROPIC_API_KEY não configurada no ambiente."))
    (do
      (println "Enviando commits para a API do Claude...")
      (let [url "https://api.anthropic.com/v1/messages"
            system-prompt "Você é um experiente analista de engenharia de software e escritor técnico. Seu trabalho é ler uma lista de commits semanais brutos de um engenheiro de software e escrever um artigo técnico de 'Dev Diary' (diário de bordo de desenvolvimento) em formato JSON. O JSON de retorno deve ter a seguinte estrutura exata:
{
  \"title\": \"Título atraente do diário de bordo (ex: Diário de Bordo: Desbravando Event Sourcing e Latência)\",
  \"excerpt\": \"Um resumo de duas linhas sobre o que foi construído ou aprendido nesta semana.\",
  \"tags\": [\"Clojure\", \"Go\", \"Event Sourcing\"],
  \"content\": \"O conteúdo completo do post em formato Markdown. Inclua seções sobre conquistas da semana, desafios técnicos resolvidos e decisões de arquitetura baseadas nos commits listados. Use um tom profissional sênior e engajador.\"
}"
            body (json/generate-string
                  {:model "claude-3-5-sonnet-20241022"
                   :max_tokens 4000
                   :system system-prompt
                   :messages [{:role "user" :content prompt}]})
            response (http/post url {:headers {"x-api-key" anthropic-key
                                               "anthropic-version" "2023-06-01"
                                               "content-type" "application/json"}
                                     :body body})]
        (if (= (:status response) 200)
          (let [res-json (json/parse-string (:body response) true)
                text-content (get-in res-json [:content 0 :text])]
            ;; Limpar o markdown de blocos de código markdown adicionados pelo modelo
            (let [clean-json (if (str/includes? text-content "```json")
                               (-> text-content
                                   (str/replace "```json" "")
                                   (str/replace "```" "")
                                   str/trim)
                               (str/trim text-content))]
              (json/parse-string clean-json true)))
          (throw (Exception. (str "Erro na API do Claude. Status: " (:status response) " Body: " (:body response)))))))))

(defn update-posts-json [new-post]
  (let [file-path "static/posts.json"
        existing-posts (if (.exists (io/file file-path))
                         (json/parse-string (slurp file-path) true)
                         [])
        ;; Filtrar para evitar duplicados caso o script rode duas vezes no mesmo dia
        filtered-posts (filter #(not= (:id %) (:id new-post)) existing-posts)
        updated-posts (conj filtered-posts new-post)]
    (spit file-path (json/generate-string updated-posts {:pretty true}))
    (println "Arquivo" file-path "atualizado com sucesso!")))

(defn -main []
  (try
    (let [seven-days-ago (.minus (Instant/now) (Duration/ofDays 7))
          since-str (str (.toString seven-days-ago))
          repos (get-repositories)]
      (if (empty? repos)
        (println "Nenhum repositório público encontrado ou erro de conexão.")
        (let [repos-with-commits (keep (fn [repo]
                                         (let [commits (get-recent-commits (:name repo) since-str)]
                                           (when (seq commits)
                                             [(:name repo) commits])))
                                       repos)]
          (if (empty? repos-with-commits)
            (println "Nenhum commit realizado nos últimos 7 dias.")
            (let [formatted-prompt (format-commits-prompt repos-with-commits)
                  user-prompt (str "Aqui estão os meus commits da última semana nos meus repositórios:\n\n"
                                   formatted-prompt
                                   "\n\nPor favor, escreva o meu Dev Diary semanal contendo o JSON de resposta.")
                  claude-response (call-claude-api user-prompt)
                  today-str (.format (DateTimeFormatter/ofPattern "yyyy-MM-dd") (Instant/now))
                  post-id (str today-str "-dev-diary")
                  
                  ;; Criar metadados para posts.json
                  metadata-entry {:id post-id
                                  :title (:title claude-response)
                                  :excerpt (:excerpt claude-response)
                                  :date today-str
                                  :readTime "10 min"
                                  :tags (:tags claude-response)}
                  
                  ;; Caminhos para salvar
                  post-file-path (str "static/posts/" post-id ".pt.md")]
              
              ;; Salvar post Markdown
              (io/make-parents post-file-path)
              (spit post-file-path (:content claude-response))
              (println "Artigo salvo em" post-file-path)
              
              ;; Atualizar lista posts.json
              (update-posts-json metadata-entry)
              (println "Dev Diary semanal gerado e salvo com sucesso!"))))))
    (catch Exception e
      (println "Erro na execução da pipeline:" (.getMessage e))
      (.printStackTrace e))))

(-main)
