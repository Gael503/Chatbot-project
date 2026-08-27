import {defineRouting} from 'next-intl/routing';
// configuramos los idiomas soportados y el por defecto
export const routing = defineRouting({
    locales: ['en', 'es'],
    defaultLocale: 'es'
});