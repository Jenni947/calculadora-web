const display = document.getElementById("display");
const history = document.getElementById("history");
const teamList = document.getElementById("team-list");

let current = "0";
let previous = null;
let operator = null;
let resetNext = false;
let memory = 0;

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

// MOSTRAR RESULTADO
function render() {
    display.textContent = current.replace(".", ",");
}

// CRIAR BOTÕES DOS TIMES
function createTeams() {
    teamList.innerHTML = "";

    teams.forEach(team => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "team-button";
        button.dataset.team = team.name;

        const img = document.createElement("img");
        img.src = team.crest;
        img.alt = "Escudo do " + team.name;

        img.onerror = () => {
            img.alt = "Escudo indisponível";
        };

        const name = document.createElement("span");
        name.textContent = team.name;

        const check = document.createElement("strong");
        check.className = "team-check";

        button.append(img, name, check);

        button.addEventListener("click", () => {
            selectTeam(team);
        });

        teamList.appendChild(button);
    });
}

// ESCOLHER TIME
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
        const selected = button.dataset.team === team.name;

        button.classList.toggle("active", selected);
        button.querySelector(".team-check").textContent =
            selected ? "✓" : "";
    });
}

// LIMPAR
function clear() {
    current = "0";
    previous = null;
    operator = null;
    resetNext = false;
    history.textContent = "";
    render();
}

// DIGITAR NÚMEROS
function input(value) {
    if (current === "Erro") current = "0";

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

// DECIMAL
function decimal() {
    if (resetNext || current === "Erro") {
        current = "0.";
        resetNext = false;
    } else if (!current.includes(".")) {
        current += ".";
    }

    render();
}

// CALCULAR
function calculate() {
    if (previous === null || operator === null) return;

    const a = Number(previous);
    const b = Number(current);
    let result;

    switch (operator) {
        case "+":
            result = a + b;
            break;
        case "-":
            result = a - b;
            break;
        case "*":
            result = a * b;
            break;
        case "/":
            if (b === 0) {
                current = "Erro";
                history.textContent = "Divisão por zero!";
                previous = null;
                operator = null;
                render();
                return;
            }
            result = a / b;
            break;
    }

    history.textContent = `${previous} ${operator} ${current} =`;

    current = Number.isFinite(result)
        ? String(Number(result.toPrecision(12)))
        : "Erro";

    previous = null;
    operator = null;
    resetNext = true;

    render();
}

// BOTÕES DA CALCULADORA
document.querySelectorAll(".key").forEach(button => {
    button.addEventListener("click", () => {
        const value = button.dataset.value;
        const action = button.dataset.action;

        if (value !== undefined) {
            if (/^\d$/.test(value)) {
                input(value);
            } else if (value === ".") {
                decimal();
            } else {
                if (current === "Erro") return;

                if (operator && !resetNext) {
                    calculate();
                }

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
                decimal();
                break;

            case "sign":
                if (current !== "0" && current !== "Erro") {
                    current = String(-Number(current));
                    render();
                }
                break;

            case "percent":
                if (current !== "Erro") {
                    current = String(Number(current) / 100);
                    render();
                }
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

// INICIAR
createTeams();
selectTeam(teams[0]);
render();



        