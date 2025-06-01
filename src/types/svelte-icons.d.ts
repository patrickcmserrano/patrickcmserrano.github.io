// Type declarations for svelte-icons
declare module 'svelte-icons/fa/*.svelte' {
  import { ComponentType, SvelteComponent } from 'svelte';
  
  interface IconProps {
    style?: string;
    className?: string;
  }
  
  const component: ComponentType<SvelteComponent<IconProps>>;
  export default component;
}
