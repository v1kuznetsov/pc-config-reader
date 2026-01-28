import inquirer from "inquirer";
import chalk from "chalk";
import getSystemInfo from "./components/getSystemInfo.ts";
import clipboard from "clipboardy";
import Systeminformation from "systeminformation";
import { toGB, toMB } from "./lib/utils.ts";
import { minutesToTime } from "./lib/utils.ts";
import { percentColor } from "./lib/utils.ts";

const systemInfo = await getSystemInfo();

const label = chalk.gray;
const value = chalk.white;
const number = chalk.yellow;
const divider = chalk.gray("────────────────────────────────────");

async function configMenu(
  configData: any,
  menuType: "cpu" | "ram" | "gpuControllers" | "battery",
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
  const title = chalk.bold.cyan("🧭 SYSTEM INFORMATION");
  const subtitle = chalk.gray("Select a category to inspect");
  console.log(title);
  console.log(subtitle);
  console.log(divider);
  const menu = await inquirer.prompt([
    {
      type: "select",
      name: "menu",
      message: chalk.cyan("What do you want to check?"),
      choices: [
        { name: chalk.yellow("🧠 CPU"), value: "cpu" },
        { name: chalk.green("📦 RAM"), value: "ram" },
        { name: chalk.magenta("🎮 GPU Controllers"), value: "gpu" },
        { name: chalk.blue("🔋 Battery"), value: "battery" },
        new inquirer.Separator(),
        { name: chalk.red("⏻ Exit"), value: "exit" },
      ],
    },
  ]);
  if (menu.menu === "cpu") {
    cpuInfo(systemInfo.cpu);
  } else if (menu.menu === "ram") {
    ramInfo(systemInfo.mem);
  } else if (menu.menu === "gpu") {
    gpuControllersInfo(systemInfo.graphics);
  } else if (menu.menu === "battery") {
    batteryInfo(systemInfo.battery);
  } else if (menu.menu === "exit") {
    exit();
  }
}
async function cpuInfo(cpu: Systeminformation.Systeminformation.CpuData) {
  console.clear();
  const title = chalk.bold.cyan("🧠  CPU INFORMATION");
  console.log(title);
  console.log(divider);
  console.log(`${label("Manufacturer:")} ${value(cpu.manufacturer)}`);
  console.log(`${label("Brand:")}        ${value(cpu.brand)}`);
  console.log(`${label("Vendor:")}       ${value(cpu.vendor)}`);
  console.log(`${label("Family:")}       ${number(cpu.family)}`);
  console.log(`${label("Model:")}        ${number(cpu.model)}`);
  console.log(`${label("Stepping:")}     ${number(cpu.stepping)}`);
  console.log(`${label("Speed:")}        ${number(cpu.speed)} GHz`);
  console.log(divider);
  console.log(`${label("Cores (logical):")}   ${number(cpu.cores)}`);
  console.log(`${label("Cores (physical):")}  ${number(cpu.physicalCores)}`);
  console.log(`${label("Performance cores:")} ${number(cpu.performanceCores)}`);
  console.log(`${label("Efficiency cores:")}  ${number(cpu.efficiencyCores)}`);
  console.log(`${label("Processors:")}       ${number(cpu.processors)}`);
  console.log(divider);
  console.log(chalk.bold.magenta("Cache"));
  console.log(
    `${label("L1d:")} ${number(cpu.cache.l1d)} KB   ` +
      `${label("L1i:")} ${number(cpu.cache.l1i)} KB`,
  );
  console.log(
    `${label("L2:")}  ${number(cpu.cache.l2)} KB   ` +
      `${label("L3:")} ${number(cpu.cache.l3)} KB`,
  );
  console.log(divider);
  configMenu(cpu, "cpu");
}
async function ramInfo(mem: Systeminformation.Systeminformation.MemData) {
  console.clear();
  const title = chalk.bold.cyan("📦 MEMORY INFORMATION");
  console.log(title);
  console.log(divider);
  console.log(`${label("Total:")}      ${number(toGB(mem.total))}`);
  console.log(`${label("Used:")}       ${number(toGB(mem.used))}`);
  console.log(`${label("Free:")}       ${number(toGB(mem.free))}`);
  console.log(`${label("Available:")}  ${number(toGB(mem.available))}`);
  console.log(divider);
  console.log(chalk.bold.magenta("Swap"));
  console.log(`${label("Total:")}      ${number(toGB(mem.swaptotal))}`);
  console.log(`${label("Used:")}       ${number(toGB(mem.swapused))}`);
  console.log(`${label("Free:")}       ${number(toGB(mem.swapfree))}`);
  console.log(divider);
  configMenu(mem, "ram");
}
async function gpuControllersInfo(
  gpu: Systeminformation.Systeminformation.GraphicsData,
) {
  console.clear();
  const title = chalk.bold.cyan("🎮 GPU CONTROLLERS");
  console.log(title);
  console.log(divider);
  if (!gpu.controllers.length) {
    console.log(chalk.red("No GPU controllers detected"));
    return;
  }
  for (const [index, controller] of gpu.controllers.entries()) {
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
    console.log(chalk.bold.magenta("Memory"));
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
    if (index < gpu.controllers.length - 1) {
      console.log(divider);
    }
  }
  console.log(divider);
  configMenu(gpu, "gpuControllers");
}
async function batteryInfo(
  battery: Systeminformation.Systeminformation.BatteryData,
) {
  console.clear();

  if (!battery.hasBattery) {
    console.log(
      chalk.bold.red("⚠️  No battery detected or data not available!"),
    );
    return;
  }

  const title = chalk.bold.cyan("🔋 BATTERY INFORMATION");
  console.log(title);
  console.log(divider);
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
  console.log(chalk.bold.magenta("Capacity"));
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
  console.log(chalk.bold.magenta("Electrical"));
  console.log(
    `${label("Voltage:")}     ${value(
      battery.voltage ? `${battery.voltage} V` : "—",
    )}`,
  );
  console.log(divider);
  console.log(battery.acConnected);

  configMenu(battery, "battery");
}
function exit() {
  console.clear();
  console.log(chalk.green.bold("\nSee you next time 👋\n"));
  process.exit(0);
}
main();
