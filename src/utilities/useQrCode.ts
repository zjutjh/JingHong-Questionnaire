import { ref, onMounted } from "vue";
import QRCode from "qrcode";
import { ElMessage } from "element-plus";
import { showModal } from "@/components";

export const useQrCode = (url: string) => {
  const qrCodeURL = ref(""); // 用于存储二维码的 base64 URL
  // 复制二维码到剪贴板
  const generateQRCode = async () => {
    try {
      qrCodeURL.value = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF"
        }
      });
    } catch (error) {
      console.error("二维码生成失败:", error);
    }
  };

  onMounted(() => {
    generateQRCode();
  });

  // 复制二维码到剪贴板
  const copyQrCode = async () => {
    try {
      const response = await fetch(qrCodeURL.value);
      const blob = await response.blob();
      const tempItem = new ClipboardItem({ [blob.type]: blob });
      await navigator.clipboard.write([tempItem]);
      showModal("showQRcodeModal", true);
      ElMessage({
        message: "二维码复制成功",
        type: "success"
      });
    } catch {
      ElMessage({
        message: "二维码复制失败",
        type: "error"
      });
    }
  };
  return {
    qrCodeURL,
    copyQrCode
  };
};
