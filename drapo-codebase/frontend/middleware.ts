import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "dz"],
  defaultLocale: "en",
});

export const config = {
  matcher: ["/((?!_next|.*\..*).*)"],
};
