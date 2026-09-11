export const getContactsQuery = `
    select id, phone, created_at, last_interaction from contact c where 1 = 1
`
export const getHistoryQuery = `
    select ref, keyword, answer, created_at, contact_id, COUNT(*) OVER()::int AS total from history h where 1 = 1
`