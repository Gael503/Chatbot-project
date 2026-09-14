export const UpdateLastLoginQuery = `update users set last_login = now() where email = $1 and id =$2;`

export const ValidateAccess = `select u.id user_id, u.email, u.is_active from users u where u.email = $1 and u.id = $2 and u.is_active = true;`