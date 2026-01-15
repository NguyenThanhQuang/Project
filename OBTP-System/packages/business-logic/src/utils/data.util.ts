import { Types } from "mongoose";

/**
 * Đệ quy chuyển đổi `_id` (ObjectId) thành `id` (string)
 * Loại bỏ `__v` và password nếu sót.
 */
export const sanitizeAndTransformData = (data: any): any => {
  if (!data) return data;

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeAndTransformData(item));
  }

  if (data instanceof Date) {
    return data;
  }

  // Handle Mongoose ObjectId
  if (
    data instanceof Types.ObjectId ||
    (typeof data === "object" && data._bsontype === "ObjectID")
  ) {
    return data.toString();
  }

  if (typeof data === "object") {
    // Nếu là Mongoose Document, chuyển về POJO
    if (typeof data.toObject === "function") {
      data = data.toObject();
    }

    const newData: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        if (key === "_id") {
          newData["id"] = data[key].toString();
        } else if (key === "__v" || key === "passwordHash") {
          continue; // Xóa rác và mật khẩu nếu vô tình lọt lưới
        } else {
          newData[key] = sanitizeAndTransformData(data[key]);
        }
      }
    }
    return newData;
  }

  return data;
};
