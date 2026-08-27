import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import { routing } from './routing';
import fs from 'fs/promises';
import path from 'path';

export default getRequestConfig(async ({requestLocale}) => {
    const requested = await requestLocale;
    const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
    const dirPath = path.join(process.cwd(), 'messages', locale);
    const files = await fs.readdir(dirPath);
    const messages = Object.fromEntries(
        await Promise.all(files.filter((file) => file.endsWith('.json')).map(async (file) => {
            const content = await fs.readFile(path.join(dirPath, file),'utf-8');
            // se le quita el .json
            return [file.replace('.json', ''), JSON.parse(content)];
        }))
    );
    return {
        locale,
        messages
    };
});
