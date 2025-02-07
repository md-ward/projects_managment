function imgUrlChecker(url: string): string {
  if (!url) {
    return "/";
  } else if (url.toString().startsWith("blob")) {
    return url;
  } else if (!url.toString().startsWith("http") && url !== undefined) {
    return "/" + url;
  } else {
    return url;
  }
}

export default imgUrlChecker;
