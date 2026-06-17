import { google } from "googleapis"

function getDriveClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || "").replace(/\\n/g, "\n")

  if (!email || !privateKey) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY not set")
  }

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/drive"],
  })

  return google.drive({ version: "v3", auth })
}

/**
 * Share a Drive folder with a customer email (view-only, no download/copy).
 * Returns the permission ID so it can be stored for later revocation.
 */
export async function shareDriveFolder(folderId: string, customerEmail: string): Promise<string | null> {
  try {
    const drive = getDriveClient()

    const permission = await drive.permissions.create({
      fileId: folderId,
      requestBody: {
        type: "user",
        role: "reader",
        emailAddress: customerEmail,
      },
      fields: "id",
      sendNotificationEmail: true,
    })


    console.log(`[Google Drive] Shared folder ${folderId} with ${customerEmail} — permission: ${permission.data.id}`)
    return permission.data.id || null
  } catch (err: any) {
    console.error(`[Google Drive] Failed to share folder ${folderId} with ${customerEmail}:`, err.message)
    return null
  }
}

/**
 * Revoke a customer's access to a Drive folder by their email.
 */
export async function revokeDriveAccess(folderId: string, customerEmail: string): Promise<void> {
  try {
    const drive = getDriveClient()

    // List all permissions on the folder
    const perms = await drive.permissions.list({
      fileId: folderId,
      fields: "permissions(id,emailAddress)",
    })

    const match = (perms.data.permissions || []).find(
      (p) => p.emailAddress?.toLowerCase() === customerEmail.toLowerCase()
    )

    if (!match?.id) {
      console.warn(`[Google Drive] No permission found for ${customerEmail} on folder ${folderId}`)
      return
    }

    await drive.permissions.delete({
      fileId: folderId,
      permissionId: match.id,
    })

    console.log(`[Google Drive] Revoked access for ${customerEmail} on folder ${folderId}`)
  } catch (err: any) {
    console.error(`[Google Drive] Failed to revoke access for ${customerEmail} on folder ${folderId}:`, err.message)
  }
}
