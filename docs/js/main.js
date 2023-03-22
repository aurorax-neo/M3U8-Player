const setRespHeaderRuleId = 1e3;
let keepSetHeaderIntHand;

function senKeepSignal() {
    keepSetHeaderIntHand = window.setInterval((function () {
        window.postMessage({
            type: "keepSetHeader",
            keepTime: 5e3,
            ruleId: 1e3
        }, location.href)
    }), 1e3)
}

function getParams(e) {
    let a = e.split("?");
    if (a.length > 1) {
        let t = a[1].split("&");
        let n = {};
        if (t && t.length) {
            t.map((e) => {
                let a = e.split("=");
                let t = a[0];
                n[t] = a[1];
            });
        }
        return n;
    }
}

"serviceWorker" in navigator && navigator.serviceWorker.register("./js/sw.js").then((function (e) {
    navigator.serviceWorker.addEventListener("message", (function (e) {
        const a = e.data;
        "sw.killCros" === a.type ? window.postMessage({
            type: "setHeader",
            domain: a.hostname,
            value: {
                "SetItse2-Access-Control-Allow-Origin": "*"
            },
            keepTime: "5000",
            ruleId: 1e3
        }, location.href) : "sw.addCros" === a.type && window.postMessage({
            type: "setHeader",
            domain: a.hostname,
            value: {
                "Access-Control-Allow-Origin": "*"
            },
            keepTime: "5000",
            ruleId: 1e3
        }, location.href), senKeepSignal()
    }))
})), document.getElementById("playBtn").addEventListener("click", (function (e) {
    let a = document.getElementById("playUrl").value;
    a.startsWith("http") ? startPlay(a) : alert("Not a valid url!"), e.preventDefault()
}));
let playUrl, urlParams = getParams(window.location.href);

function startPlay(e) {
    document.getElementById("playerCon").style.display = "block";

    let player = new Aliplayer({
        id: "thePlayer",
        source: e,
        width: "100%",
        height: "400px",
        autoplay: true,
        playsinline: true,
        preload: true,
        extraInfo: {
            crossOrigin: "anonymous"
        },
        skinLayout: [
            {
                name: "bigPlayButton",
                align: "blabs",
                x: 30,
                y: 80
            },
            {
                name: "H5Loading",
                align: "cc"
            },
            {
                name: "errorDisplay",
                align: "tlabs",
                x: 0,
                y: 0
            },
            {
                name: "infoDisplay"
            },
            {
                name: "tooltip",
                align: "blabs",
                x: 0,
                y: 56
            },
            {
                name: "thumbnail"
            },
            {
                name: "controlBar",
                align: "blabs",
                x: 0,
                y: 0,
                children: [
                    {
                        name: "progress",
                        align: "blabs",
                        x: 0,
                        y: 44
                    },
                    {
                        name: "playButton",
                        align: "tl",
                        x: 15,
                        y: 12
                    },
                    {
                        name: "timeDisplay",
                        align: "tl",
                        x: 10,
                        y: 7
                    },
                    {
                        name: "fullScreenButton",
                        align: "tr",
                        x: 10,
                        y: 12
                    },
                    {
                        name: "setting",
                        align: "tr",
                        x: 15,
                        y: 12
                    },
                    {
                        name: "volume",
                        align: "tr",
                        x: 5,
                        y: 10
                    },
                    {
                        name: "snapshot",
                        align: "tr",
                        x: 10,
                        y: 12
                    }
                ]
            }
        ]
    }, () => {
        console.log("The player is created");
    });

    player.on("snapshoted", (e) => {
        let a = e.paramData.base64;
        let link = document.createElement("a");
        link.setAttribute("href", a);
        let n = "cococut_screen_shot" + Date.now() + ".png";
        link.setAttribute("download", n);
        link.click();
        a = null;
    });
}

if (urlParams && urlParams.m3u8) {
    playUrl = decodeURIComponent(urlParams.m3u8);
    if (playUrl) {
        startPlay(playUrl);
    }
}