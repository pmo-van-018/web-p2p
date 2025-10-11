export const formatFile = (file) => {
  const timestamp = new Date().getTime()
  const extension = file.name.split('.').pop();
  const filename = `${timestamp}-${file.name.replace(extension, '').replace(/[^a-zA-Z0-9]/g, '')}.${extension}`;
  return new File([file], filename, {
    type: file.type,
    lastModified: file.lastModified
  });
}
