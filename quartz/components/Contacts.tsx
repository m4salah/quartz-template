import { QuartzComponentConstructor } from "./types"

const contancts = [
  {
    icon: <i class="fa fa-github"></i>,
    link: "https://github.com/m4salah",
  },
  {
    icon: <i class="fa fa-envelope"></i>,
    link: "mailto:me@msalah.net",
  },
  {
    icon: <i class="fa fa-linkedin-square"></i>,
    link: "https://www.linkedin.com/in/mohamed-a-salah",
  },
]

export default (() => {
  function YourComponent() {
    return (
      <>
        {contancts.map((contanct) => {
          return (
            <a className={"page-title"} href={contanct.link}>
              {contanct.icon}
            </a>
          )
        })}
      </>
    )
  }

  return YourComponent
}) satisfies QuartzComponentConstructor
