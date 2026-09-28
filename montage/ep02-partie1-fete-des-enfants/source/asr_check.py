import json, sys, wave, difflib, re, numpy as np, sherpa_onnx
A='../asr/sherpa-onnx-whisper-small/'
rec=sherpa_onnx.OfflineRecognizer.from_whisper(encoder=A+'small-encoder.onnx',decoder=A+'small-decoder.onnx',tokens=A+'small-tokens.txt',language='th',task='transcribe',num_threads=8)
tl=json.load(open('timeline.json'))
norm=lambda s:re.sub(r'[\s!?.,ๆ]','',s)
res=[]
only=set(sys.argv[1:])
for ln in tl['lines']:
    if only and ln['file'] not in only and str(ln['i']) not in only: continue
    w=wave.open('vo/'+ln['file']);x=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').astype(np.float32)/32768;sr=w.getframerate();pad=np.zeros(int(sr*.8),np.float32);x=np.concatenate([pad,x,pad])
    s=rec.create_stream();s.accept_waveform(sr,x);rec.decode_stream(s);hyp=s.result.text.strip()
    ref=ln['text']
    r=difflib.SequenceMatcher(None,norm(ref),norm(hyp)).ratio()
    res.append((r,ln['i'],ln['who'],ref,hyp))
res.sort()
for r,i,w,ref,hyp in res: print(f'{r:.2f} #{i:03d} {w} | {ref} | {hyp}')
print('mean',round(sum(r[0] for r in res)/len(res),3))
