if (error) {
  setMsg(error.message);
  setLoading(false);
  return;
}

window.location.href = "/";