export const getCurrentPrompt = `
    select p.id, p.content, u.name AS created_by,
    p.version_num, p.created_at, p.is_active
    from prompts p
    inner join users u on p.created_by = u.id
    where p.is_active = TRUE;
`;

export const getPrompts = `
    select p.id, p.content, u.name AS created_by,
    p.version_num, p.created_at, p.is_active,
    COUNT(*) OVER()::int AS total
    from prompts p
    inner join users u on p.created_by = u.id

`

export const deactivatePrompts = `update prompts set is_active = FALSE where is_active = TRUE;`;

export const activatePromptQuerie = `update prompts set is_active = TRUE where id = $1 returning id;`;

export const createNewPrompt = `
    insert into prompts (content, created_by) values ($1, $2)
    returning id, content, created_by, version_num, created_at, is_active;
`;