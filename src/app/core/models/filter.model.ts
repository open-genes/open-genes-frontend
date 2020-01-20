/**
 * Интерфейс, описывающий набор фильтров таблицы генов
 */
export interface IFilter {
  name: boolean;     // Название гена
  age: boolean;      // Возраст, смотрит на origin.order
  cluster: number[];    // Функциональный класс
  expression: string;   // Возрастные изменения экспрессии
}
