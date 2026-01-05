import { Calendar } from "lucide-react";
import { useRef } from "react";

interface CustomDatePickerProps {
  label?: string;
  value: string;
  onChange: (date: string) => void;
  min?: string;
  required?: boolean;
}

export const CustomDatePicker = ({ label, value, onChange, min, required }: CustomDatePickerProps) => {
  // Tạo ref để điều khiển input thật
  const inputRef = useRef<HTMLInputElement>(null);

  const formatDisplayDate = (isoDate: string) => {
    if (!isoDate) return "dd/mm/yyyy";
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
  };

  // Hàm xử lý khi click vào khung
  const handleContainerClick = () => {
    if (inputRef.current) {
      try {
        // Cách mới: Bắt buộc trình duyệt hiện lịch (Chrome/Edge/Firefox mới)
        if (typeof inputRef.current.showPicker === "function") {
          inputRef.current.showPicker();
        } else {
          // Cách cũ: Focus vào input để hiện lịch
          inputRef.current.focus();
        }
      } catch (error) {
        console.error("Không thể mở lịch:", error);
      }
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ml-1">
          {label}
        </label>
      )}
      
      {/* Thêm onClick vào div bao ngoài */}
      <div 
        onClick={handleContainerClick}
        className="relative group w-full cursor-pointer"
      >
        {/* LỚP 1: Giao diện hiển thị */}
        <div className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl flex items-center text-gray-900 dark:text-white transition-all font-medium group-hover:border-blue-500 group-hover:ring-2 group-hover:ring-blue-500/20">
          <Calendar className="absolute left-4 w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
          
          <span className={value ? "text-gray-900 dark:text-white" : "text-gray-400"}>
            {formatDisplayDate(value)}
          </span>
        </div>

        {/* LỚP 2: Input thật (Ẩn xuống dưới nhưng vẫn nhận giá trị) */}
        <input
          ref={inputRef}
          type="date"
          value={value}
          min={min}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          // pointer-events-none để click xuyên qua nó xuống div cha (div cha sẽ gọi showPicker)
          className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
        />
      </div>
    </div>
  );
};