// src/services/categories.service.ts
import api, { toFail } from "@/lib/axios";
import type { Category } from "@/types/category.interface";
import type { GeneralResponse } from "@/types/general-response.interface";

const BASE = "/categories";

export interface CreateCategoryDto {
  name: string;
  slug?: string;
  description: string;
  isActive?: boolean;
}

export type UpdateCategoryDto = Partial<CreateCategoryDto>;

export const getAllCategories = async (): Promise<
  GeneralResponse<Category[]>
> => {
  try {
    const { data } = await api.get<Category[]>(BASE);
    return { success: true, data };
  } catch (e) {
    return toFail<Category[]>(e);
  }
};

export const getCategoryById = async (
  id: string
): Promise<GeneralResponse<Category>> => {
  try {
    const { data } = await api.get<Category>(`${BASE}/${id}`);
    return { success: true, data };
  } catch (e) {
    return toFail<Category>(e);
  }
};

export const getCategoryBySlug = async (
  slug: string
): Promise<GeneralResponse<Category>> => {
  try {
    const { data } = await api.get<Category>(`${BASE}/slug/${slug}`);
    return { success: true, data };
  } catch (e) {
    return toFail<Category>(e);
  }
};

export const createCategory = async (
  payload: CreateCategoryDto
): Promise<GeneralResponse<Category>> => {
  try {
    const { data } = await api.post<Category>(BASE, payload);
    return { success: true, data };
  } catch (e) {
    return toFail<Category>(e);
  }
};

export const updateCategory = async (
  id: string,
  payload: UpdateCategoryDto
): Promise<GeneralResponse<Category>> => {
  try {
    const { data } = await api.patch<Category>(`${BASE}/${id}`, payload);
    return { success: true, data };
  } catch (e) {
    return toFail<Category>(e);
  }
};

export const deleteCategory = async (
  id: string
): Promise<GeneralResponse<null>> => {
  try {
    // El backend hace soft-delete (isActive = false) internamente
    await api.delete(`${BASE}/${id}`);
    return { success: true, data: null };
  } catch (e) {
    return toFail<null>(e);
  }
};