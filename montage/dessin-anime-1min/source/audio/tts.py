import re
import sherpa_onnx, wave, struct
cfg = sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(vits=sherpa_onnx.OfflineTtsVitsModelConfig(model='vits-mms-tha/model.onnx', tokens='vits-mms-tha/tokens.txt'), num_threads=4))
tts = sherpa_onnx.OfflineTts(cfg)
lines = [
 ('n1','ณ หมู่บ้านเล็กๆ กลางทุ่งนาสีเขียว'),
 ('n2','มีเด็กชายคนหนึ่ง ชื่อน้องข้าว'),
 ('b1','สวัสดีครับ ผมชื่อน้องข้าว'),
 ('n3','และนี่คือเพื่อนรักของเขา ควายน้อยชื่อทุย'),
 ('n4','วันนี้ น้องข้าวจะปลูกต้นข้าวต้นแรกของตัวเอง'),
 ('b2','ปลูกเบาๆ นะ ต้นข้าวน้อย'),
 ('n5','ฝนตกลงมา รดน้ำให้ต้นข้าว'),
 ('n6','แสงแดดส่องอบอุ่น ต้นข้าวค่อยๆ เติบโตขึ้นทุกวัน'),
 ('n7','ไม่นานนัก ทุ่งนาก็กลายเป็นสีทองอร่าม'),
 ('b3','เย้ ต้นข้าวของเราโตแล้ว'),
 ('n8','ความขยันและความอดทน ทำให้ทุกอย่างงอกงาม'),
]
def prep(t):
    t=t.replace('เล็กๆ','เล็กเล็ก').replace('เบาๆ','เบาเบา').replace('ค่อยๆ','ค่อยค่อย')
    return t.replace('\u0e33','\u0e4d\u0e32')
for name, text in lines:
    text=prep(text)
    a = tts.generate(text, sid=0, speed=0.95)
    w = wave.open(name + '.wav', 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(a.sample_rate)
    w.writeframes(b''.join(struct.pack('<h', max(-32767, min(32767, int(x * 32767)))) for x in a.samples)); w.close()
    print(name, round(len(a.samples) / a.sample_rate, 2))
