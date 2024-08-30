import { i18n } from "../i18n"
import { FullSlug, joinSegments, pathToRoot } from "../util/path"
import { JSResourceToScriptElement } from "../util/resources"
import { googleFontHref } from "../util/theme"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

export default (() => {
  const Head: QuartzComponent = ({ cfg, fileData, externalResources }: QuartzComponentProps) => {
    const title = fileData.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title
    const description =
      fileData.description?.trim() ?? i18n(cfg.locale).propertyDefaults.description
    const { css, js } = externalResources

    const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
    const path = url.pathname as FullSlug
    const baseDir = fileData.slug === "404" ? path : pathToRoot(fileData.slug!)

    const ogImagePath = `https://${cfg.baseUrl}/static/og-image.png`

    return (
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        {cfg.theme.cdnCaching && cfg.theme.fontOrigin === "googleFonts" && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link rel="stylesheet" href={googleFontHref(cfg.theme)} />
          </>
        )}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {cfg.baseUrl && <meta property="og:image" content={ogImagePath} />}
        <meta property="og:width" content="1200" />
        <meta property="og:height" content="675" />
        <link rel="apple-touch-icon" sizes="57x57" href="static/apple-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="static/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="static/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="static/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="static/apple-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="static/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="static/apple-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="static/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="static/apple-icon-180x180.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="static/android-icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="static/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="static/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="static/favicon-16x16.png" />
        <link rel="manifest" href="static/manifest.json" />
        <link rel="stylesheet" href="static/font-awesome-4.7.0/css/font-awesome.min.css" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="description" content={description} />
        <meta name="generator" content="Quartz" />
        {css.map((href) => (
          <link key={href} href={href} rel="stylesheet" type="text/css" spa-preserve />
        ))}
        {js
          .filter((resource) => resource.loadTime === "beforeDOMReady")
          .map((res) => JSResourceToScriptElement(res, true))}
      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor
