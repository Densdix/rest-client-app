import { ContentRequest } from '@/app/(protected)/restclient/_components/Content';

function replaceVariables(str: string, variables: Record<string, string> = {}): string {
  if (!str || !str.includes('{{')) return str;

  return str.replace(/\{\{([^}]+)\}\}/g, (match, variableName) => {
    return variables[variableName] || '';
  });
}

export function generateRequestCode(data: ContentRequest) {
  if (!data.url || !data.method) {
    return 'Not enough data to generate code.';
  }

  const variables: Record<string, string> = data.environment || {};

  const processedUrl = replaceVariables(data.url, variables);

  const headersObj = (data.headers || [])
    .filter((h) => h.isActive && h.name)
    .reduce(
      (acc, h) => {
        const processedValue = replaceVariables(h.value, variables);
        return { ...acc, [h.name]: processedValue };
      },
      {} as Record<string, string>
    );
  const headersArr = Object.entries(headersObj);

  const hasBody = !!data.body && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(data.method.toUpperCase());
  const bodyStr = hasBody ? replaceVariables(data.body, variables) : undefined;

  let curl = `curl -X ${data.method.toUpperCase()} "${processedUrl}"`;
  headersArr.forEach(([k, v]) => {
    curl += ` \\\n  -H "${k}: ${v}"`;
  });
  if (bodyStr) {
    curl += ` \\\n  -d '${bodyStr.replace(/'/g, "\\'")}'`;
  }

  let jsFetch = `fetch("${data.url}", {\n  method: "${data.method.toUpperCase()}",`;
  if (headersArr.length) {
    jsFetch += `\n  headers: ${JSON.stringify(headersObj, null, 2)},`;
  }
  if (bodyStr) {
    jsFetch += `\n  body: \`${bodyStr}\`,`;
  }
  jsFetch += `\n})\n  .then(res => res.json())\n  .then(console.log);`;

  let jsXHR = `var xhr = new XMLHttpRequest();\nxhr.open("${data.method.toUpperCase()}", "${data.url}", true);\n`;
  headersArr.forEach(([k, v]) => {
    jsXHR += `xhr.setRequestHeader("${k}", "${v}");\n`;
  });
  jsXHR += `xhr.onreadystatechange = function () {\n  if (xhr.readyState === 4) {\n    console.log(xhr.responseText);\n  }\n};\n`;
  if (bodyStr) {
    jsXHR += `xhr.send(\`${bodyStr}\`);`;
  } else {
    jsXHR += `xhr.send();`;
  }

  let node = `const https = require('https');\n\nconst options = {\n  method: '${data.method.toUpperCase()}',\n  headers: ${JSON.stringify(headersObj, null, 2)}\n};\n\nconst req = https.request("${data.url}", options, res => {\n  let data = '';\n  res.on('data', chunk => data += chunk);\n  res.on('end', () => console.log(data));\n});\n`;
  if (bodyStr) {
    node += `req.write(\`${bodyStr}\`);\n`;
  }
  node += `req.end();`;

  let py = `import requests\nurl = "${data.url}"\nheaders = ${JSON.stringify(headersObj, null, 2)}\n`;
  if (bodyStr) {
    py += `data = '''${bodyStr}'''\nresponse = requests.request("${data.method.toUpperCase()}", url, headers=headers, data=data)\n`;
  } else {
    py += `response = requests.request("${data.method.toUpperCase()}", url, headers=headers)\n`;
  }
  py += `print(response.text)`;

  let java = `import java.io.*;\nimport java.net.*;\n\nURL url = new URL("${data.url}");\nHttpURLConnection con = (HttpURLConnection) url.openConnection();\ncon.setRequestMethod("${data.method.toUpperCase()}");\n`;
  headersArr.forEach(([k, v]) => {
    java += `con.setRequestProperty("${k}", "${v}");\n`;
  });
  if (bodyStr) {
    java += `con.setDoOutput(true);\ntry(OutputStream os = con.getOutputStream()) {\n  byte[] input = "${bodyStr.replace(/"/g, '\\"')}".getBytes("utf-8");\n  os.write(input, 0, input.length);\n}\n`;
  }
  java += `BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream(), "utf-8"));\nStringBuilder response = new StringBuilder();\nString responseLine;\nwhile ((responseLine = br.readLine()) != null) {\n  response.append(responseLine.trim());\n}\nSystem.out.println(response.toString());`;

  let csharp = `using System.Net.Http;\nusing System.Text;\n\nvar client = new HttpClient();\nvar request = new HttpRequestMessage(HttpMethod.${data.method.charAt(0).toUpperCase() + data.method.slice(1).toLowerCase()}, "${data.url}");\n`;
  headersArr.forEach(([k, v]) => {
    csharp += `request.Headers.Add("${k}", "${v}");\n`;
  });
  if (bodyStr) {
    csharp += `request.Content = new StringContent("${bodyStr.replace(/"/g, '\\"')}", Encoding.UTF8, "${headersObj['Content-Type'] || 'application/json'}");\n`;
  }
  csharp += `var response = await client.SendAsync(request);\nvar responseBody = await response.Content.ReadAsStringAsync();\nConsole.WriteLine(responseBody);`;

  let go = `package main\nimport (\n  "fmt"\n  "io/ioutil"\n  "net/http"\n  "strings"\n)\n\nfunc main() {\n  client := &http.Client{}\n  req, _ := http.NewRequest("${data.method.toUpperCase()}", "${data.url}", ${bodyStr ? `strings.NewReader(\`${bodyStr}\`)` : 'nil'} )\n`;
  headersArr.forEach(([k, v]) => {
    go += `  req.Header.Add("${k}", "${v}")\n`;
  });
  go += `  resp, _ := client.Do(req)\n  defer resp.Body.Close()\n  body, _ := ioutil.ReadAll(resp.Body)\n  fmt.Println(string(body))\n}`;

  return {
    curl,
    jsFetch,
    jsXHR,
    node,
    py,
    java,
    csharp,
    go,
  };
}
