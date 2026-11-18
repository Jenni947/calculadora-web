const display = document.getElementById("display");
const history = document.getElementById("history");
const teamList = document.getElementById("team-list");

let current = "0";
let previous = null;
let operator = null;
let resetNext = false;
let memory = 0;

// Clubes e escudos
const teams = [
    {
        name: "Corinthians",
        short: "CORINTHIANS",
        crest: "https://media.api-sports.io/football/teams/131.png",
        primary: "#ed101c",
        secondary: "#8b0000"
    },
    {
        name: "Palmeiras",
        short: "PALMEIRAS",
        crest: "https://media.api-sports.io/football/teams/121.png",
        primary: "#16834b",
        secondary: "#07552e"
    },
    {
        name: "São Paulo",
        short: "SÃO PAULO",
        crest: "https://media.api-sports.io/football/teams/126.png",
        primary: "#e32636",
        secondary: "#8b0000"
    },
    {
        name: "Santos",
        short: "SANTOS",
        crest: "https://media.api-sports.io/football/teams/128.png",
        primary: "#dddddd",
        secondary: "#777777"
    },
    {
        name: "Flamengo",
        short: "FLAMENGO",
        crest: "https://media.api-sports.io/football/teams/127.png",
        primary: "#ed101c",
        secondary: "#8b0000"
    },
    {
        name: "Vasco",
        short: "VASCO",
        crest: "https://media.api-sports.io/football/teams/133.png",
        primary: "#cccccc",
        secondary: "#555555"
    }
];

function render() {
    display.textContent = current.replace(".", ",");
}

function selectTeam(team) {
    document.documentElement.style.setProperty("--primary", team.primary);
    document.documentElement.style.setProperty("--secondary", team.secondary);
    document.documentElement.style.setProperty("--glow", team.primary + "55");

    document.getElementById("team-name").textContent = team.name;
    document.getElementById("display-team-name").textContent = team.short;
    document.getElementById("footer-team").textContent = "VAI " + team.short + "!";

    const crest = document.getElementById("main-crest");
    crest.src = team.crest;
    crest.alt = "Escudo do " + team.name;

    document.querySelector(".display-area").style.setProperty(
        "--crest-watermark",
        `url("${team.crest}")`
    );

    document.querySelectorAll(".team-button").forEach(button => {
        button.classList.toggle("active", button.dataset.team === team.name);
        button.querySelector(".team-check").textContent =
            button.dataset.team === team.name ? "✓" : "";
    });
}

teams.forEach(team => {
    const button = document.createElement("button");
    button.className = "team-button";
    button.dataset.team = team.name;

    button.innerHTML = `
        <img src="${team.crest}" alt="">
        <span>${team.name}</span>
        <strong class="team-check"></strong>
    `;

    button.addEventListener("click", () => selectTeam(team));
    teamList.appendChild(button);
});

function input(value) {
    if (resetNext) {
        current = value;
        resetNext = false;
    } else if (current === "0") {
        current = value;
    } else {
        current += value;
    }
    render();
}

function clear() {
    current = "0";
    previous = null;
    operator = null;
    history.textContent = "";
    resetNext = false;
    render();
}

function calculate() {
    if (previous === null || operator === null) return;

    const a = Number(previous);
    const b = Number(current);
    let result;

    switch (operator) {
        case "+": result = a + b; break;
        case "-": result = a - b; break;
        case "*": result = a * b; break;
        case "/":
            if (b === 0) {
                current = "Erro";
                history.textContent = "Não é possível dividir por zero";
                render();
                return;
            }
            result = a / b;
            break;
    }

    if (!Number.isFinite(result)) {
        current = "Erro";
    } else {
        history.textContent = `${previous} ${operator} ${current} =`;
        current = String(Number(result.toPrecision(12)));
    }

    previous = null;
    operator = null;
    resetNext = true;
    render();
}

document.querySelectorAll(".key").forEach(button => {
    button.addEventListener("click", () => {
        const value = button.dataset.value;
        const action = button.dataset.action;

        if (value !== undefined) {
            if ("0123456789".includes(value) && value.length === 1) {
                input(value);
            } else if (value === ".") {
                if (resetNext) {
                    current = "0.";
                    resetNext = false;
                } else if (!current.includes(".")) {
                    current += ".";
                }
                render();
            } else {
                if (operator && !resetNext) calculate();
                previous = current;
                operator = value;
                resetNext = true;
                history.textContent = `${current} ${operator}`;
            }
            return;
        }

        switch (action) {
            case "clear":
                clear();
                break;

            case "decimal":
                if (resetNext) {
                    current = "0.";
                    resetNext = false;
                } else if (!current.includes(".")) {
                    current += ".";
                }
                render();
                break;

            case "sign":
                if (current !== "0") {
                    current = String(-Number(current));
                    render();
                }
                break;

            case "percent":
                current = String(Number(current) / 100);
                render();
                break;

            case "equals":
                calculate();
                break;

            case "memory-clear":
                memory = 0;
                break;

            case "memory-recall":
                current = String(memory);
                resetNext = true;
                render();
                break;

            case "memory-add":
                memory += Number(current) || 0;
                break;

            case "memory-subtract":
                memory -= Number(current) || 0;
                break;
        }
    });
});

// Iniciar com Corinthians
selectTeam(teams[0]);
render();


        