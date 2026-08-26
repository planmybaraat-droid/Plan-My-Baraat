/**
 * Creates a unique owner password for each generated PDF while leaving the
 * user password empty. The document therefore opens normally, but compliant
 * PDF readers only grant the explicitly listed user permissions.
 *
 * Printing remains available. Editing, copying, annotations/forms and page
 * assembly are intentionally not granted.
 */
export function createPdfPermissionLock() {
  const bytes = new Uint8Array(24);
  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }

  const ownerPassword = Array.from(bytes, value => value.toString(16).padStart(2, '0')).join('');
  return {
    userPassword: '',
    ownerPassword,
    userPermissions: ['print'] as ('print')[],
  };
}
