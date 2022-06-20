const SHOW_IDS_CLASS = "show-item-ids";
let showIds = false;

const SHOW_IDS_TEXT = "Show Entry IDs";
const HIDE_IDS_TEXT = "Hide Entry IDs";

function toggleBtnText(node) {
  const text = showIds ? SHOW_IDS_TEXT : HIDE_IDS_TEXT;
  node.textContent = text;
}

function handleToggleIds() {
  const body = document.querySelector("body");
  document.querySelectorAll(".toggle-btn").forEach(toggleBtnText);
  if (showIds) {
    body.classList.remove(SHOW_IDS_CLASS);
  } else {
    body.classList.add(SHOW_IDS_CLASS);
  }
  showIds = !showIds;
}

window.addEventListener("DOMContentLoaded", () => {
  let prevH2 = null;
  let prevH3 = null;
  let newBody = document.createElement("body");

  function cleanNode(node) {
    node.innerHTML = node.innerHTML.replace(
      /\[[0-9]+\]/g,
      (match) => `<span class="item-id">${match}</span>`
    );
  }

  document.body.childNodes.forEach((node) => {
    let clonedNode = node.cloneNode(true);
    const { nodeName } = node;

    if (nodeName === "H2") {
      if (prevH3 !== null) {
        prevH2.querySelector("ul").appendChild(prevH3);
      }
      // add existing sections to new body
      if (prevH2 !== null) {
        // last element cant add itself so we'll add it here
        newBody.appendChild(prevH2);
      }
      // new div
      const newDiv = document.createElement("div");
      const newUl = document.createElement("ul");
      const toggleBtn = document.createElement("button");
      toggleBtn.classList.add("toggle-btn");
      toggleBtn.textContent = SHOW_IDS_TEXT;
      toggleBtn.addEventListener("click", handleToggleIds);

      newDiv.className = "types";

      if (clonedNode.textContent === "TalkMsg.fmg") {
        newDiv.classList.add("talk-msgs");
      }
      // if (
      //   clonedNode.textContent === "BloodMsg.fmg" ||
      //   clonedNode.textContent === "AccessoryInfo.fmg" ||
      //   clonedNode.textContent === "WeaponEffect.fmg" ||
      //   clonedNode.textContent === "WeaponInfo.fmg" ||
      //   clonedNode.textContent === "ProtectorInfo.fmg" ||
      //   clonedNode.textContent === "PlaceName.fmg"
      // ) {
      //   newDiv.className = `${newDiv.className} messages`;
      // }
      clonedNode.appendChild(toggleBtn);
      newDiv.appendChild(clonedNode);
      newDiv.appendChild(newUl);
      console.log(newDiv.innerText, newDiv);
      console.log(prevH2, prevH3);
      // swapperoo
      prevH2 = newDiv;
      // clean up
      prevH3 = null;
    } else if (nodeName === "H3") {
      // add the previous h3 section to parent h2
      if (prevH2 !== null && prevH3 !== null) {
        prevH2.querySelector("ul").appendChild(prevH3);
      }
      cleanNode(clonedNode);

      // swap it!
      const newDiv = document.createElement("li");
      newDiv.appendChild(clonedNode);
      newDiv.className = "card";
      prevH3 = newDiv;
    } else if (nodeName === "P") {
      cleanNode(clonedNode);
      if (prevH3 !== null) {
        prevH3.appendChild(clonedNode);
      } else if (prevH2 !== null) {
        const newDiv = document.createElement("li");
        newDiv.appendChild(clonedNode);
        newDiv.className = "msg";
        prevH2.querySelector("ul").appendChild(newDiv);
      }
    }
  });

  if (prevH3 !== null) {
    prevH2.querySelector("ul").appendChild(prevH3);
  }
  // add existing sections to new body
  if (prevH2 !== null) {
    // last element cant add itself so we'll add it here
    newBody.appendChild(prevH2);
  }

  document.body.replaceWith(newBody);
});
