import Systeminformation from "systeminformation";

export default async function getSystemInfo() {
  const cpuInfo = await Systeminformation.cpu();
  const memInfo = await Systeminformation.mem();
  const graphicsInfo = await Systeminformation.graphics();
  const batteryInfo = await Systeminformation.battery();

  const systemInfo = {
    cpu: cpuInfo,
    mem: memInfo,
    graphics: graphicsInfo,
    battery: batteryInfo,
  };
  return systemInfo;
}
