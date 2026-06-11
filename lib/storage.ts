import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export async function uploadProjectPhoto(
  projectId: string,
  file: File,
  type: 'before' | 'after' | 'site' | 'progress'
): Promise<string> {
  const ext = file.name.split('.').pop();
  const path = `projects/${projectId}/${type}/${Date.now()}.${ext}`;
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}

export async function deleteProjectPhoto(url: string): Promise<void> {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch {
    // ignore if already deleted
  }
}

export async function uploadSiteReport(
  projectId: string,
  file: File
): Promise<string> {
  const ext = file.name.split('.').pop();
  const path = `projects/${projectId}/reports/${Date.now()}.${ext}`;
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}
