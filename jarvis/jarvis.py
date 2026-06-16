"""
Jarvis - مساعد ذكاء اصطناعي شخصي مبني على Claude API
"""

import os
import anthropic
from datetime import datetime

SYSTEM_PROMPT = """أنت Jarvis، مساعد ذكاء اصطناعي شخصي ومتطور مثل مساعد Iron Man.
مميزاتك:
- تتحدث بأسلوب محترف وودود
- تتذكر سياق المحادثة الحالية
- تساعد في البرمجة، الكتابة، البحث، وأي مهمة أخرى
- تبدأ ردودك بـ "سيدي،" عند الحاجة لإضفاء طابع Jarvis

اليوم هو: {date}
"""

def create_jarvis():
    client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
    conversation_history = []

    print("=" * 50)
    print("  JARVIS - مساعدك الذكي الشخصي")
    print("  مبني بـ Claude API")
    print("  اكتب 'خروج' أو 'quit' للإنهاء")
    print("=" * 50)
    print()

    system = SYSTEM_PROMPT.format(date=datetime.now().strftime("%Y-%m-%d %H:%M"))

    while True:
        try:
            user_input = input("أنت: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nJarvis: إلى اللقاء، سيدي.")
            break

        if not user_input:
            continue

        if user_input.lower() in ("خروج", "quit", "exit", "bye"):
            print("Jarvis: إلى اللقاء، سيدي. أتمنى لك يوماً رائعاً.")
            break

        conversation_history.append({"role": "user", "content": user_input})

        print("Jarvis: ", end="", flush=True)

        with client.messages.stream(
            model="claude-opus-4-8",
            max_tokens=2048,
            thinking={"type": "adaptive"},
            system=system,
            messages=conversation_history,
        ) as stream:
            full_response = ""
            for text in stream.text_stream:
                print(text, end="", flush=True)
                full_response += text

        print()
        print()

        conversation_history.append({"role": "assistant", "content": full_response})


if __name__ == "__main__":
    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("خطأ: يجب تعيين متغير البيئة ANTHROPIC_API_KEY")
        print("مثال: export ANTHROPIC_API_KEY='your-api-key-here'")
        exit(1)

    create_jarvis()
