export const CreateUserQuery = `
    insert into users (name, email, password) values($1, $2, $3) returning id;
`
export const getUserInfoByEmail = `
    select id, name, email, password, is_active from users u where u.email = $1 
`
export const getUserInfoById = `
    select id, name, email, password, is_active from users u where u.id = $1 
`
export const searchUsers = `
    select id, name, email, created_at, updated_at, is_active, last_login from users u where 1 = 1 
`
export const DeactivateUserQuery = `update users u set is_active = false where u.id = $1 returning u.id`