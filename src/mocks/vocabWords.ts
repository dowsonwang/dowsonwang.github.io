import type { WordBook } from "@/mocks/wordbooks";

export type VocabWord = {
  id: string;
  bookId: WordBook["id"];
  term: string;
  phonetic?: string;
  meaning: string;
  example: {
    sentence: string;
    blank: string;
    options: [string, string, string];
    answer: string;
  };
};

const en = (id: string, term: string, phonetic: string, meaning: string, sentence: string, blank: string, options: [string, string, string], answer: string): VocabWord => ({
  id,
  bookId: "zh-en",
  term,
  phonetic,
  meaning,
  example: { sentence, blank, options, answer },
});

const fr = (id: string, term: string, meaning: string, sentence: string, blank: string, options: [string, string, string], answer: string): VocabWord => ({
  id,
  bookId: "zh-fr",
  term,
  meaning,
  example: { sentence, blank, options, answer },
});

const it = (id: string, term: string, meaning: string, sentence: string, blank: string, options: [string, string, string], answer: string): VocabWord => ({
  id,
  bookId: "zh-it",
  term,
  meaning,
  example: { sentence, blank, options, answer },
});

const lo = (id: string, term: string, meaning: string, sentence: string, blank: string, options: [string, string, string], answer: string): VocabWord => ({
  id,
  bookId: "zh-lo",
  term,
  meaning,
  example: { sentence, blank, options, answer },
});

const es = (id: string, term: string, meaning: string, sentence: string, blank: string, options: [string, string, string], answer: string): VocabWord => ({
  id,
  bookId: "zh-es",
  term,
  meaning,
  example: { sentence, blank, options, answer },
});

export const vocabWords: VocabWord[] = [
  en("en_1", "insert", "/ɪnˈsɜːrt/", "vt. 插入；嵌入；（在文章中）添加", "Please _____ your name here.", "insert", ["insert", "inform", "invite"], "insert"),
  en("en_2", "suggest", "/səˈdʒest/", "v. 建议；暗示", "Could you _____ a good restaurant near here?", "suggest", ["suggest", "support", "survive"], "suggest"),
  en("en_3", "provide", "/prəˈvaɪd/", "v. 提供", "The hotel will _____ free breakfast for guests.", "provide", ["prefer", "provide", "prevent"], "provide"),
  en("en_4", "improve", "/ɪmˈpruːv/", "v. 改善；提高", "Reading every day can _____ your vocabulary.", "improve", ["include", "improve", "inform"], "improve"),
  en("en_5", "confirm", "/kənˈfɜːrm/", "v. 确认", "Please _____ your booking by email.", "confirm", ["confirm", "connect", "control"], "confirm"),
  en("en_6", "schedule", "/ˈskedʒuːl/", "n./v. 日程；安排", "Let's _____ a call for tomorrow morning.", "schedule", ["schedule", "search", "settle"], "schedule"),
  en("en_7", "achieve", "/əˈtʃiːv/", "v. 达成；实现", "With practice, you can _____ your goals.", "achieve", ["agree", "achieve", "arrive"], "achieve"),
  en("en_8", "efficient", "/ɪˈfɪʃnt/", "adj. 高效的", "Remote work can be more _____ for some people.", "efficient", ["official", "efficient", "different"], "efficient"),
  fr("fr_1", "bonjour", "你好；早上好", "_____ , je m'appelle Yuki.", "bonjour", ["bonjour", "merci", "pardon"], "bonjour"),
  fr("fr_2", "merci", "谢谢", "_____ pour votre aide.", "merci", ["bonjour", "merci", "salut"], "merci"),
  fr("fr_3", "pardon", "对不起；劳驾", "_____ , je ne comprends pas.", "pardon", ["pardon", "encore", "jamais"], "pardon"),
  fr("fr_4", "apprendre", "学习", "Je veux _____ le français.", "apprendre", ["apprendre", "attendre", "arriver"], "apprendre"),
  fr("fr_5", "parler", "说；讲话", "Je peux _____ un peu chinois.", "parler", ["parler", "porter", "payer"], "parler"),
  it("it_1", "ciao", "你好/再见", "_____ , come stai?", "ciao", ["ciao", "grazie", "scusa"], "ciao"),
  it("it_2", "grazie", "谢谢", "_____ per il tuo tempo.", "grazie", ["grazie", "ciao", "prego"], "grazie"),
  it("it_3", "scusa", "对不起", "_____ , dov'è la stazione?", "scusa", ["scusa", "bene", "sempre"], "scusa"),
  it("it_4", "imparare", "学习", "Voglio _____ l'italiano.", "imparare", ["imparare", "incontrare", "iniziare"], "imparare"),
  it("it_5", "parlare", "说", "Posso _____ lentamente?", "parlare", ["parlare", "pagare", "passare"], "parlare"),
  lo("lo_1", "ສະບາຍດີ", "你好", "_____! ຂ້ອຍຊື່ Mia.", "ສະບາຍດີ", ["ສະບາຍດີ", "ຂອບໃຈ", "ຂໍໂທດ"], "ສະບາຍດີ"),
  lo("lo_2", "ຂອບໃຈ", "谢谢", "_____ ຫຼາຍໆ.", "ຂອບໃຈ", ["ຂອບໃຈ", "ສະບາຍດີ", "ໄປກ່ອນ"], "ຂອບໃຈ"),
  lo("lo_3", "ຂໍໂທດ", "对不起", "_____ , ຂ້ອຍມາຊ້າ.", "ຂໍໂທດ", ["ຂໍໂທດ", "ຂອບໃຈ", "ດີຫຼາຍ"], "ຂໍໂທດ"),
  lo("lo_4", "ຮຽນ", "学习", "ຂ້ອຍຢາກ _____ ພາສາລາວ.", "ຮຽນ", ["ຮຽນ", "ໄປ", "ນອນ"], "ຮຽນ"),
  lo("lo_5", "ໄປ", "去", "ພວກເຮົາຈະ _____ ຮ້ານກາເຟ.", "ໄປ", ["ໄປ", "ກິນ", "ຮຽນ"], "ໄປ"),
  es("es_1", "hola", "你好", "_____ , ¿cómo estás?", "hola", ["hola", "gracias", "perdón"], "hola"),
  es("es_2", "gracias", "谢谢", "_____ por venir.", "gracias", ["gracias", "hola", "adiós"], "gracias"),
  es("es_3", "perdón", "对不起", "_____ , no entiendo.", "perdón", ["perdón", "siempre", "nunca"], "perdón"),
  es("es_4", "aprender", "学习", "Quiero _____ español.", "aprender", ["aprender", "apagar", "apuntar"], "aprender"),
  es("es_5", "hablar", "说", "¿Puedes _____ más despacio?", "hablar", ["hablar", "haber", "hacer"], "hablar"),
];

export function wordsByBook(bookId: WordBook["id"]) {
  return vocabWords.filter((w) => w.bookId === bookId);
}
