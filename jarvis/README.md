# Jarvis - مساعدك الذكي الشخصي

مبني على Claude API من Anthropic.

## التثبيت

```bash
pip install anthropic
```

## الإعداد

```bash
export ANTHROPIC_API_KEY="your-api-key-here"
```

## التشغيل

### النسخة الأساسية (محادثة عادية):
```bash
python jarvis.py
```

### النسخة المتقدمة (مع أدوات ذكية):
```bash
python jarvis_with_tools.py
```

## الأدوات المتوفرة في النسخة المتقدمة

| الأداة | الوصف |
|--------|-------|
| `get_current_time` | يعطيك الوقت والتاريخ الحالي |
| `calculate` | يحل العمليات الحسابية (`sqrt`, `sin`, `cos`, إلخ) |
| `save_note` | يحفظ ملاحظات في `notes.txt` |
| `read_notes` | يقرأ الملاحظات المحفوظة |

## أمثلة على الاستخدام

```
أنت: كم الساعة الآن؟
Jarvis: [يستخدم get_current_time]
        الساعة الآن 10:30 مساءً، الاثنين 16 يونيو 2026

أنت: احسب لي جذر 144
Jarvis: [يستخدم calculate]
        جذر 144 = 12

أنت: احفظ ملاحظة: اجتماع غداً الساعة 9 صباحاً
Jarvis: [يستخدم save_note]
        تم حفظ الملاحظة!
```

## إضافة أدوات جديدة

أضف الأداة في `TOOLS` وعرّف دالتها في `execute_tool()`:

```python
TOOLS.append({
    "name": "my_tool",
    "description": "وصف الأداة",
    "input_schema": {
        "type": "object",
        "properties": {
            "param": {"type": "string", "description": "وصف المعامل"}
        },
        "required": ["param"]
    }
})

# في execute_tool():
if tool_name == "my_tool":
    return f"نتيجة: {tool_input['param']}"
```
