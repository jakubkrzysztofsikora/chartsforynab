export const approve: (id: string) => Promise<string> = (id) => {
  console.log(`Approving ${id}`);
  return Promise.resolve("id");
};
