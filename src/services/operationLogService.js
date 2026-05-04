export function createOperationLog(action, detail) {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    action,
    detail,
    time: new Date().toLocaleString(),
  };
}
