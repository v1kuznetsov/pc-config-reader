import inquirer from "inquirer";
import chalk from "chalk";
import getSystemInfo from "./components/getSystemInfo.js";
import clipboard from "clipboardy";
import Systeminformation from "systeminformation";
import { toGB, toMB } from "./lib/utils.js";
import { minutesToTime } from "./lib/utils.js";
import { percentColor } from "./lib/utils.js";

const systemInfo = await getSystemInfo();

const title = chalk.bold.white;
const subtitle = chalk.bold.blue;
const label = chalk.gray;
const value = chalk.white;
const number = chalk.white;
const divider = chalk.gray("────────────────────────────────────");

async function configMenu(
  configData: any,
  menuType: "cpu" | "ram" | "gpuControllers" | "displays" | "battery",
) {
  const configMenu = await inquirer.prompt([
    {
      type: "select",
      name: "configMenu",
      message: chalk.cyan("What do you want to do?"),
      choices: [
        {
          name: chalk.green("📋 Copy info to clipboard (JSON)"),
          value: "copyInfo",
        },
        {
          name: chalk.red("⬅ Back to menu"),
          value: "back",
        },
      ],
    },
  ]);
  if (configMenu.configMenu === "copyInfo") {
    clipboard.writeSync(JSON.stringify(configData, null, 2));
    console.clear();
    console.log(
      "\n" +
        chalk.bold.green("✅ Config info successfully copied to clipboard!\n"),
    );
    setTimeout(() => {
      if (menuType === "cpu") {
        cpuInfo(configData);
      } else if (menuType === "ram") {
        ramInfo(configData);
      } else if (menuType === "gpuControllers") {
        gpuControllersInfo(configData);
      } else if (menuType === "displays") {
        displaysInfo(configData);
      } else if (menuType === "battery") {
        batteryInfo(configData);
      }
    }, 1500);
  } else {
    main();
  }
}
async function main() {
  console.clear();
  console.log(title("🧭 SYSTEM INFORMATION"));
  console.log(subtitle("Select a category to inspect"));
  console.log(divider);
  const menu = await inquirer.prompt([
    {
      type: "select",
      name: "menu",
      message: chalk.cyan("What do you want to check?"),
      choices: [
        { name: chalk.magenta("🧠 CPU"), value: "cpu" },
        { name: chalk.blue("📦 RAM"), value: "ram" },
        { name: chalk.yellow("🎮 GPU Controllers"), value: "gpu" },
        { name: chalk.cyan("📺 Displays"), value: "displays" },
        { name: chalk.green("🔋 Battery"), value: "battery" },
        new inquirer.Separator(),
        { name: chalk.red("🚪 Exit"), value: "exit" },
      ],
    },
  ]);
  if (menu.menu === "cpu") {
    cpuInfo(systemInfo.cpu);
  } else if (menu.menu === "ram") {
    ramInfo(systemInfo.mem);
  } else if (menu.menu === "gpu") {
    gpuControllersInfo(systemInfo.graphics.controllers);
  } else if (menu.menu === "displays") {
    displaysInfo(systemInfo.graphics.displays);
  } else if (menu.menu === "battery") {
    batteryInfo(systemInfo.battery);
  } else if (menu.menu === "exit") {
    exit();
  }
}
async function cpuInfo(cpu: Systeminformation.Systeminformation.CpuData) {
  console.clear();
  console.log(title("🧠  CPU INFORMATION"));
  console.log(divider);
  console.log(`${label("Manufacturer:")} ${value(cpu.manufacturer)}`);
  console.log(`${label("Brand:")}        ${value(cpu.brand)}`);
  console.log(`${label("Vendor:")}       ${value(cpu.vendor)}`);
  console.log(`${label("Family:")}       ${number(cpu.family)}`);
  console.log(`${label("Model:")}        ${number(cpu.model || "-")}`);
  console.log(`${label("Stepping:")}     ${number(cpu.stepping)}`);
  console.log(`${label("Speed:")}        ${number(cpu.speed)} GHz`);
  console.log(divider);
  console.log(`${label("Cores (logical):")}   ${number(cpu.cores)}`);
  console.log(`${label("Cores (physical):")}  ${number(cpu.physicalCores)}`);
  console.log(`${label("Performance cores:")} ${number(cpu.performanceCores)}`);
  console.log(`${label("Efficiency cores:")}  ${number(cpu.efficiencyCores)}`);
  console.log(`${label("Processors:")}       ${number(cpu.processors)}`);
  console.log(divider);
  console.log(subtitle("Cache"));
  console.log(
    `${label("L1d:")} ${number(cpu.cache.l1d || "-")} KB   ` +
      `${label("L1i:")} ${number(cpu.cache.l1i || "-")} KB`,
  );
  console.log(
    `${label("L2:")}  ${number(cpu.cache.l2 || "-")} KB   ` +
      `${label("L3:")} ${number(cpu.cache.l3 || "-")} KB`,
  );
  console.log(divider);
  configMenu(cpu, "cpu");
}
async function ramInfo(mem: Systeminformation.Systeminformation.MemData) {
  console.clear();
  console.log(title("📦 MEMORY INFORMATION"));
  console.log(divider);
  console.log(`${label("Total:")}      ${number(toGB(mem.total))}`);
  console.log(`${label("Used:")}       ${number(toGB(mem.used))}`);
  console.log(`${label("Free:")}       ${number(toGB(mem.free))}`);
  console.log(`${label("Available:")}  ${number(toGB(mem.available))}`);
  console.log(divider);
  console.log(subtitle("Swap"));
  console.log(`${label("Total:")}      ${number(toGB(mem.swaptotal))}`);
  console.log(`${label("Used:")}       ${number(toGB(mem.swapused))}`);
  console.log(`${label("Free:")}       ${number(toGB(mem.swapfree))}`);
  console.log(divider);
  configMenu(mem, "ram");
}
async function gpuControllersInfo(
  gpu: Systeminformation.Systeminformation.GraphicsControllerData[],
) {
  console.clear();
  console.log(title("🎮 GPU CONTROLLERS"));
  console.log(divider);
  if (!gpu.length) {
    console.log(chalk.red("No GPU controllers detected"));
    return;
  }
  for (const [index, controller] of gpu.entries()) {
    console.log(chalk.bold.magenta(`GPU #${index + 1}`));
    console.log(
      `${label("Vendor:")}        ${value(controller.vendor || "—")}`,
    );
    console.log(`${label("Model:")}         ${value(controller.model || "—")}`);
    console.log(`${label("Bus:")}           ${value(controller.bus || "—")}`);
    console.log(
      `${label("Driver:")}        ${value(controller.driverVersion || "—")}`,
    );
    console.log(divider);
    console.log(subtitle("Memory"));
    console.log(
      `${label("VRAM:")}          ${value(controller.vram ? toGB(controller.vram) : "—")}`,
    );
    console.log(
      `${label("Dynamic VRAM:")}  ${
        controller.vramDynamic ? chalk.yellow("Yes") : chalk.gray("No")
      }`,
    );
    if (
      controller.memoryTotal &&
      controller.memoryUsed &&
      controller.memoryFree
    ) {
      console.log(
        `${label("Total:")}         ${value(toMB(controller.memoryTotal))}`,
      );
      console.log(
        `${label("Used:")}          ${value(toMB(controller.memoryUsed))}`,
      );
      console.log(
        `${label("Free:")}          ${value(toMB(controller.memoryFree))}`,
      );
    }
    if (index < gpu.length - 1) {
      console.log(divider);
    }
  }
  console.log(divider);
  configMenu(gpu, "gpuControllers");
}
async function displaysInfo(
  displays: Systeminformation.Systeminformation.GraphicsDisplayData[],
) {
  console.clear();
  console.log(title("📺 DISPLAYS"));
  console.log(divider);

  if (!displays.length) {
    console.log(chalk.red("No displays detected"));
    return;
  }

  for (const [index, display] of displays.entries()) {
    console.log(chalk.bold.magenta(`Display #${index + 1}`));

    console.log(`${label("Vendor:")}        ${value(display.vendor || "—")}`);
    console.log(`${label("Model:")}         ${value(display.model || "—")}`);
    console.log(`${label("Serial:")}        ${value(display.serial || "—")}`);
    console.log(
      `${label("Display ID:")}    ${value(display.displayId || "—")}`,
    );

    console.log(divider);
    console.log(subtitle("General"));

    console.log(
      `${label("Main:")}          ${
        display.main ? chalk.green("Yes") : chalk.gray("No")
      }`,
    );
    console.log(
      `${label("Built-in:")}      ${
        display.builtin ? chalk.green("Yes") : chalk.gray("No")
      }`,
    );
    console.log(
      `${label("Connection:")}    ${value(display.connection || "—")}`,
    );

    console.log(divider);
    console.log(subtitle("Resolution"));

    console.log(
      `${label("Native:")}        ${value(
        display.resolutionX && display.resolutionY
          ? `${display.resolutionX}×${display.resolutionY}`
          : "—",
      )}`,
    );

    console.log(
      `${label("Current:")}       ${value(
        display.currentResX && display.currentResY
          ? `${display.currentResX}×${display.currentResY}`
          : "—",
      )}`,
    );

    if (index < displays.length - 1) {
      console.log(divider);
    }
  }

  console.log(divider);
  configMenu(displays, "displays");
}
async function batteryInfo(
  battery: Systeminformation.Systeminformation.BatteryData,
) {
  console.clear();
  console.log(title("🔋 BATTERY INFORMATION"));
  console.log(divider);
  if (!battery.hasBattery) {
    console.log(
      chalk.bold.red("⚠️  No battery detected or data not available!"),
    );
    console.log(
      `${label("Power source:")}  ${
        battery.acConnected
          ? chalk.green("AC adapter 🔌")
          : chalk.yellow("Battery 🔋")
      }`,
    );
    console.log(divider);
  } else {
    console.log(`${label("Type:")}         ${value(battery.type || "—")}`);
    console.log(`${label("Model:")}        ${value(battery.model || "—")}`);
    console.log(
      `${label("Manufacturer:")} ${value(battery.manufacturer || "—")}`,
    );
    console.log(`${label("Serial:")}       ${value(battery.serial || "—")}`);
    console.log(divider);
    console.log(
      `${label("Power source:")}  ${
        battery.acConnected
          ? chalk.green("AC adapter 🔌")
          : chalk.yellow("Battery 🔋")
      }`,
    );
    console.log(
      `${label("Charge:")}       ${percentColor(battery.percent)(
        `${battery.percent}%`,
      )}`,
    );
    console.log(
      `${label("Charging:")}     ${
        battery.isCharging ? chalk.green("Yes") : chalk.gray("No")
      }`,
    );
    console.log(
      `${label("Time remaining:")} ${value(
        minutesToTime(battery.timeRemaining),
      )}`,
    );
    console.log(divider);
    const unit = battery.capacityUnit || "";
    console.log(subtitle("Capacity"));
    console.log(
      `${label("Current:")}     ${value(
        `${battery.currentCapacity ?? "—"} ${unit}`,
      )}`,
    );
    console.log(
      `${label("Designed:")}    ${value(
        `${battery.designedCapacity ?? "—"} ${unit}`,
      )}`,
    );
    console.log(
      `${label("Max:")}         ${value(
        `${battery.maxCapacity ?? "—"} ${unit}`,
      )}`,
    );
    console.log(`${label("Cycles:")}      ${value(battery.cycleCount ?? "—")}`);
    console.log(divider);
    console.log(subtitle("Electrical"));
    console.log(
      `${label("Voltage:")}     ${value(
        battery.voltage ? `${battery.voltage} V` : "—",
      )}`,
    );
    console.log(divider);
  }
  configMenu(battery, "battery");
}
function exit() {
  console.clear();
  console.log(chalk.green.bold("\nSee you next time 👋\n"));
  setTimeout(() => {
    console.clear();
    process.exit(0);
  }, 1000);
}
main();
