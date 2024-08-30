import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    Component.MobileOnly(
      Component.ExplorerBurger({
        folderDefaultState: "open",
        folderClickBehavior: "link",
      }),
    ),
    Component.PageTitle(),
    Component.DesktopOnly(Component.Spacer()),
    Component.Contacts(),
    Component.MobileOnly(Component.Spacer()),
    Component.MobileOnly(Component.Search()),
    Component.MobileOnly(Component.Darkmode()),
  ],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/m4salah/quartz-template",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.DesktopOnly(Component.Search()),
    Component.DesktopOnly(Component.Darkmode()),
    Component.DesktopOnly(
      Component.ExplorerBurger({
        folderClickBehavior: "link",
        folderDefaultState: "collapsed",
        useSavedState: true,
        title: "",
      }),
    ),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: defaultContentPageLayout.beforeBody,
  left: defaultContentPageLayout.left,
  right: [],
}
