export function buildCareerContentPrompt(title: string, cluster: string, hollandCodes: string[]): string {
  return `Sen bir kariyer rehberi yazarısın. "${title}" mesleği hakkında Türkçe, bilgilendirici ve samimi bir içerik oluştur.

Meslek: ${title}
Alan: ${cluster}
Holland Profili: ${hollandCodes.join(', ')}

Yalnızca aşağıdaki JSON formatında yanıt ver, başka hiçbir şey yazma:

{
  "dailyLife": "Bu mesleği yapan birinin tipik bir iş gününü anlat. Sabah ne zaman başlıyor, hangi görevleri yapıyor, kimlerle çalışıyor, günü nasıl bitiyor? Somut ve canlı bir anlatım yaz. (3-4 paragraf, markdown kullan)",
  "universityCourses": ["Ders 1", "Ders 2", "Ders 3", ...],
  "jobOpportunities": "Mezuniyet sonrası çalışılabilecek sektörleri, pozisyonları ve kariyer yollarını anlat. Türkiye ve dünya genelindeki iş olanaklarını belirt. (2-3 paragraf, markdown kullan)",
  "avgSalaryRange": "Türkiye'deki yaklaşık maaş aralığı (örn: 25.000 – 60.000 TL)"
}

Kurallar:
- universityCourses: 8-12 adet ders adı listesi
- Tüm metinler Türkçe
- dailyLife ve jobOpportunities markdown formatında
- Yalnızca JSON, hiçbir ek açıklama veya markdown bloku ekleme`
}
