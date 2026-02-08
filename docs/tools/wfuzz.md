# Wfuzz

**Category:** Web Application Fuzzing  
**Risk Level:** 🟡 Medium  
**Requires Root:** No

## Description

Wfuzz is a web application fuzzer for brute-forcing web applications, finding hidden resources, and testing parameters.

## What It Does

- URL fuzzing
- Parameter fuzzing
- Header fuzzing
- POST data fuzzing
- Cookie fuzzing

## Risks & Legal Considerations

| Risk | Description |
|------|-------------|
| **Detection** | High request volume detected |
| **Blocking** | May trigger WAF |
| **Legal** | Unauthorized fuzzing is illegal |

## Pros

✅ Extremely flexible  
✅ Multiple injection points  
✅ Filter response  

## Cons

❌ Noisy, many requests  
❌ Can overwhelm servers  
❌ Requires careful tuning  

## Related Tools

- [gobuster](gobuster.md) - Directory fuzzing
- [dirb](dirb.md) - Directory brute-force
