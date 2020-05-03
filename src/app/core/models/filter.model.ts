/**
 * Интерфейс, описывающий набор фильтров таблицы генов
 */
export interface Filter {
  byName: boolean;            // по названию гена
  byAge: boolean;             // по возрасту, смотрит на origin.order
  byClasses: number[];        // по функциональным классам
  byExpressionChange: number; // по варианту возрастного изменения экспрессии
}
