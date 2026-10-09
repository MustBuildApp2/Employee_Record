# Employee Records Mobile REST API

This backend is implemented with Next.js App Router route handlers under `app/api/**`.

## Authentication

Mobile clients should use bearer access tokens:

```http
Authorization: Bearer <accessToken>
```

Access tokens are short-lived. Refresh tokens are stored server-side as SHA-256 hashes in `refresh_sessions` and rotated by `/api/auth/refresh`.

## Endpoints

| Endpoint | Method | Auth | Purpose |
|---|---:|---|---|
| `/api/auth/login` | POST | No | Verify email/password and return safe user + tokens |
| `/api/auth/refresh` | POST | Refresh token | Rotate refresh token and issue a new access token |
| `/api/auth/logout` | POST | Optional | Revoke refresh token when supplied |
| `/api/auth/me` | GET | Bearer | Return the current user profile |
| `/api/employees` | GET | Bearer | List employees with pagination/search/filter |
| `/api/employees` | POST | Manager/Admin/Super Admin | Create an employee |
| `/api/employees/[id]` | GET | Bearer | Retrieve one employee |
| `/api/employees/[id]` | PATCH | Manager/Admin/Super Admin | Update employee fields |
| `/api/employees/[id]` | DELETE | Manager/Admin/Super Admin | Soft-delete employee |
| `/api/employees/[id]/documents` | GET | Bearer | List employee documents |
| `/api/employees/[id]/documents` | POST | Manager/Admin/Super Admin | Upload document with `multipart/form-data` field `file` |
| `/api/employees/[id]/documents/[documentId]` | GET | Bearer | Download one document |
| `/api/employees/[id]/documents/[documentId]` | PATCH | Manager/Admin/Super Admin | Update document metadata |
| `/api/employees/[id]/documents/[documentId]` | DELETE | Manager/Admin/Super Admin | Soft-delete document metadata |
| `/api/employees/[id]/documents.zip` | GET | Bearer | Download authorized employee documents as a ZIP |
| `/api/users` | GET | Super Admin | List portal users |
| `/api/users` | POST | Super Admin | Create portal user |
| `/api/users/[id]` | GET | Super Admin | Retrieve portal user |
| `/api/users/[id]` | PATCH | Super Admin | Update portal user |
| `/api/users/[id]` | DELETE | Super Admin | Suspend portal user |

## Response Shape

Success:

```json
{
  "success": true,
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid fields."
  }
}
```

## Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"user@example.com\",\"password\":\"your-password\"}"
```

## Employee List

```bash
curl http://localhost:3000/api/employees?page=1&pageSize=25 \
  -H "Authorization: Bearer <accessToken>"
```

## Document Upload

```bash
curl -X POST http://localhost:3000/api/employees/1/documents \
  -H "Authorization: Bearer <accessToken>" \
  -F "file=@passport_copy.pdf" \
  -F "documentType=passport"
```

## Database

Review and apply `migrations/001_mobile_backend.sql` to a PostgreSQL database after confirming it does not conflict with any existing schema.

No demo users are inserted automatically. Create initial users with approved provisioning only, using password hashes produced by the backend password utility or a trusted admin workflow.
