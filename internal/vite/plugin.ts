export default {
    name: "ui-proccessor",
    transform(code: string, id: string) {
        if (!id.includes("tsx") && !id.includes("jsx")) return;

        const name = getJSXElementName(code);

        let newCode = replaceFunctions(code, name);

        newCode = replaceImport(newCode);

        console.log(newCode);
        newCode = replaceSignalHTMLElement(newCode);

        return {
            code: newCode,
            map: null,
        };
    },
};

const usedIds: string[] = [];

function replaceImport(code: string) {
    const regex = /import\s*([^+]*)\s*from\s*"@UIFunctions"/g;

    return code.replace(regex, `import $1 from "@UIFunctions_internal"`);
}

function replaceSignalHTMLElement(code: string) {
    // const regex = /UI.createElement\s*\(\s*("[^]")\s*,\s*{([^]*)}\s*,\s*(\w+).value\)/g;
    // Replace the createElement with the new one (if has parameters)
    let regex =
        /UI.createElement\s*\(\s*?("[^*]*")\s*,\s*{([^*]*)\s*},\s*(\w+).value\s*/g;

    let newCode = code.replaceAll(
        regex,
        `UI.createElement($1, {$2, ["data-rui-"+$3.id]: $3.lastValue, "uid": "${generateId()}"}, $3.value`
    );

    // Replace the createElement with the new one (if has no parameters)
    // regex =
    //     /UI.createElement\s*\(\s*?(".*?")\s*,\s*null,\s*(.*?)\s*(\w+).value\s*,?\s*(.*?)?\s*\)/g;

    // const match = newCode.match(regex);

    // if (!match) return newCode;

    // console.log(match);

    // match.forEach((createElement) => {
    //     const newElement = createElement.replaceAll(
    //         regex,
    //         `UI.createElement($1, {["data-rui-"+$3.id]: $3.lastValue, "uid": "${generateId()}"}, $2)`
    //     );

    //     newCode = newCode.replace(createElement, newElement);
    // })

    return newCode;
}

function replaceFunctions(code: string, name: string) {
    let newCode = code;

    const id = generateId();

    // useSignal

    // Add id to useSignal
    newCode = newCode.replaceAll(
        /(\w+)\s*=\s*useSignal\s*\(\s*([^*])\s*?\)\s*;/g,
        `$1 = useSignal($2, "$1-${id}");`
    );

    // Add function name to useSignal
    newCode = newCode.replaceAll(
        /=\s*useSignal\s*\(\s*/g,
        `= useSignal(${name}, `
    );

    // useEffect
    newCode = newCode.replaceAll(/useEffect\s*\(\s*/g, `useEffect(${name}, `);

    return newCode;
}

function getJSXElementName(code: string) {
    const match = code.match(/export\s+default\s+function\s+(\w+)\(.*\)/i);
    if (!match) return "";
    return match[1];
}

function generateId() {
    let id = Math.random().toString(36).substring(7);
    while (usedIds.includes(id)) id = Math.random().toString(36).substring(7);
    usedIds.push(id);
    return id;
}
