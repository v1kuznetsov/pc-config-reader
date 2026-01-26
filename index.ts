import inquirer from "inquirer";
import chalk from "chalk";
import getSystemInfo from "./utils/getSystemInfo.ts";
import clipboard from "clipboardy";

async function main() {
  console.clear();
  const systemInfo = await getSystemInfo();
  const menu = await inquirer.prompt([
    {
      type: "select",
      name: "menu",
      message: "What do you want to check?",
      choices: [
        { name: "CPU", value: "cpu" },
        { name: "RAM", value: "ram" },
        { name: "GPU", value: "gpu" },
        { name: "Battery", value: "battery" },
        { name: "Exit", value: "exit" },
      ],
    },
  ]);
  if (menu.menu === "cpu") {
    cpuInfo(systemInfo.cpu);
  } else if (menu.menu === "ram") {
    ramInfo(systemInfo.mem);
  } else if (menu.menu === "gpu") {
    gpuInfo(systemInfo.graphics);
  } else if (menu.menu === "battery") {
    batteryInfo(systemInfo.battery);
  } else if (menu.menu === "exit") {
    exit();
  }
}
async function cpuInfo(cpu: any) {
  console.log(cpu);
  const cpuMenu = await inquirer.prompt([
    {
      type: "select",
      name: "cpuMenu",
      message: "What do you want to do?",
      choices: [
        {
          name: "Copy CPU info to the clipboard in JSON",
          value: "copyCpuInfo",
        },
        { name: "Back to menu", value: "back" },
      ],
    },
  ]);
  if (cpuMenu.cpuMenu === "copyCpuInfo") {
    clipboard.writeSync(JSON.stringify(cpu));
    console.log("\n✅ CPU info successfully copied to clipboard!\n");
    cpuInfo(cpu);
  } else if (cpuMenu.cpuMenu === "back") {
    main();
  }
}
async function ramInfo(mem: any) {
  console.log(mem);
  const ramMenu = await inquirer.prompt([
    {
      type: "select",
      name: "ramMenu",
      message: "What do you want to do?",
      choices: [
        {
          name: "Copy RAM info to the clipboard in JSON",
          value: "copyRamInfo",
        },
        { name: "Back to menu", value: "back" },
      ],
    },
  ]);
  if (ramMenu.ramMenu === "copyRamInfo") {
    clipboard.writeSync(JSON.stringify(mem));
    console.log("\n✅ RAM info successfully copied to clipboard!\n");
    ramInfo(mem);
  } else if (ramMenu.ramMenu === "back") {
    main();
  }
}
async function gpuInfo(gpu: any) {
  console.log(gpu);
  const gpuMenu = await inquirer.prompt([
    {
      type: "select",
      name: "gpuMenu",
      message: "What do you want to do?",
      choices: [
        {
          name: "Copy GPU info to the clipboard in JSON",
          value: "copyGpuInfo",
        },
        { name: "Back to menu", value: "back" },
      ],
    },
  ]);
  if (gpuMenu.gpuMenu === "copyGpuInfo") {
    clipboard.writeSync(JSON.stringify(gpu));
    console.log("\n✅ GPU info successfully copied to clipboard!\n");
    gpuInfo(gpu);
  } else if (gpuMenu.gpuMenu === "back") {
    main();
  }
}
async function batteryInfo(battary: any) {
  console.log(battary);
  const batteryMenu = await inquirer.prompt([
    {
      type: "select",
      name: "batteryMenu",
      message: "What do you want to do?",
      choices: [
        {
          name: "Copy battery info to the clipboard in JSON",
          value: "copyBatteryInfo",
        },
        { name: "Back to menu", value: "back" },
      ],
    },
  ]);
  if (batteryMenu.batteryMenu === "copyBatteryInfo") {
    clipboard.writeSync(JSON.stringify(battary));
    console.log("\n✅ Battery info successfully copied to clipboard!\n");
    batteryInfo(battary);
  } else if (batteryMenu.batteryMenu === "back") {
    main();
  }
}
function exit() {
  return console.log(chalk.greenBright.bold("\n✅ Stay safe out there!\n"));
}
main();
