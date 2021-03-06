import React from "react"
import ReactDOM from "react-dom"

import {camelCase, upperFirst} from "lodash"

import hljs from "highlight.js"
import "highlight.js/styles/github-gist.css"

import LiveSocket from "phoenix_live_view"

import {token} from "./auth"

import * as factory from "./components"
import {CommitLineReview} from "./components"

export default () => {
  document.querySelectorAll("article.message").forEach(flash => {
    flash.querySelector("button.delete").addEventListener("click", event => {
      flash.remove()
    })
  })

  document.querySelectorAll(".code .code-inner").forEach(block => hljs.highlightBlock(block))

  document.querySelectorAll("[data-react-class]").forEach(e => {
    const targetId = document.getElementById(e.dataset.reactTargetId)
    const targetDiv = targetId ? targetId : e
    const reactProps = e.dataset.reactProps ? atob(e.dataset.reactProps) : "{}"
    const reactElement = React.createElement(factory[upperFirst(camelCase(e.dataset.reactClass))], JSON.parse(reactProps))
    ReactDOM.render(reactElement, targetDiv)
  })

  if(document.querySelector("[data-phx-view]")) {
    let liveSocket = new LiveSocket("/live")
    liveSocket.connect()
  }

  if(token) {
    document.querySelectorAll("table.diff-table").forEach(table => {
      table.querySelectorAll("tbody tr:not(.hunk) td.code").forEach(td => {
        let origin
        if(td.classList.contains("origin")) {
          td.querySelector("button").addEventListener("click", event => {
            let tr = td.parentElement
            if(!tr.nextElementSibling || !tr.nextElementSibling.classList.contains("inline-comments")) {
              let row = table.insertRow(tr.rowIndex+1);
              row.classList.add("inline-comments")
              ReactDOM.render(React.createElement(CommitLineReview, {...table.dataset, ...event.currentTarget.dataset}), row);
            }
            tr.nextElementSibling.querySelector(".comment-form:last-child form [name='comment[body]']").focus()
          })
          origin = td
        } else {
          origin = td.previousElementSibling
        }
        td.addEventListener("mouseover", () => origin.classList.add("is-active"))
        td.addEventListener("mouseout", () => origin.classList.remove("is-active"))
      })
    })
  }
}
