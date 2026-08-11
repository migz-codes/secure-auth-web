/**
 * Side-effect CSS imports (`import '@/styles/globals.css'`) have no type
 * declaration of their own. `tsc --noEmit` accepts them through the Next
 * plugin, but the editor's TS server reports "Cannot find module or type
 * declarations for side-effect import" without this ambient declaration.
 *
 * `*.module.css` is more specific and keeps whatever Next declares for it.
 */
declare module '*.css'
