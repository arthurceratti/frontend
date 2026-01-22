import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './areaclient.css';

//const token = localStorage.getItem('token');
//console.log('Retrieved token in AreaClient:', token);

const aiTextGenerator = async (prompt) => {
    try {
      console.log('Generating AI text with prompt:', prompt);
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
          'Access-Control-Allow-Origin': '*',
      };
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/ai-prompt`, {
        prompt,
        headers,   
      })
      return response;
    } catch (error) {
    console.error('Error generating text:', error);
    return 'Error generating text';
  }
}

const retrieveClientData = async (start, stop) => {
  const token = localStorage.getItem('token');

  try {
    console.log('Retrieving client data with start:', start, 'stop:', stop, token);
    // Build query params only if start/stop provided (convert Dates to ISO strings)
    let params = {};
    if (start) params.start = start instanceof Date ? start.toISOString() : start;
    if (stop) params.stop = stop instanceof Date ? stop.toISOString() : stop;

    params = {start, stop};
    console.log('Query params for data retrieval:', params);

    // Get token from localStorage
   //const token = localStorage.getItem('token');

    // Build headers including token for authentication
    const headers = {
      'Authorization': `Bearer ${token}`,
        'Access-Control-Allow-Origin': '*',
    };
    console.log('Request headers for data retrieval:', headers);
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/show-data`, {
      params,
      headers,
    })
    return response.data;

  } catch (error) {
    console.error('Error fetching client data:', error);
    return null;
  }
}

const LineChart = ({ series, name, width = 700, height = 240, color = '#FF0000' }) => {
  if (!series || series.length === 0) return <div className="chart-empty">No data for {name}</div>;

  const times = series.map(p => p.t.getTime());
  const values = series.map(p => p.v);
  const minT = Math.min(...times);
  const maxT = Math.max(...times);
  const minV = Math.min(...values);
  const maxV = Math.max(...values);

  const pad = 32;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;

  const xFor = (t) => {
    if (maxT === minT) return pad + innerW / 2;
    return pad + ((t - minT) / (maxT - minT)) * innerW;
  };
  const yFor = (v) => {
    if (maxV === minV) return pad + innerH / 2;
    return pad + (1 - (v - minV) / (maxV - minV)) * innerH;
  };

  const pathD = series.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xFor(p.t.getTime()).toFixed(2)} ${yFor(p.v).toFixed(2)}`).join(' ');

  const firstLabel = new Date(minT).toLocaleString();
  const lastLabel = new Date(maxT).toLocaleString();

  return (
    <div className="chart-wrapper">
      <div className="chart-header"><strong>{name}</strong></div>
      <svg width={width} height={height} className="line-chart" role="img" aria-label={`${name} line chart`}>
        <line x1={pad} y1={pad} x2={pad} y2={pad + innerH} stroke="#eee" />
        <line x1={pad} y1={pad + innerH} x2={pad + innerW} y2={pad + innerH} stroke="#eee" />

        <path d={pathD} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        {series.map((p, i) => (
          <circle key={i} cx={xFor(p.t.getTime())} cy={yFor(p.v)} r={2.5} fill={color} />
        ))}

        <text x={pad} y={height - 6} fontSize="11" fill="#6b7280">{firstLabel}</text>
        <text x={width - pad - 4} y={height - 6} fontSize="11" fill="#6b7280" textAnchor="end">{lastLabel}</text>
      </svg>
    </div>
  );
};

const measurementColors = {
  temperatura: '#ef4444',
  umidade: '#3b82f6',
};
const populateAISummary = async (seriesByMeasurement, setAiSummary, setAiLoading) => {
  setAiLoading(true);
  let prompt = 'Provide the average temperature and the average humidity and return an html compatible summary from the following data:\n\n';

  Object.keys(seriesByMeasurement).forEach(name => {
    const series = seriesByMeasurement[name];
    const limitedSeries = series.slice(0, 5); // Take only first 10 rows

    prompt += `Measurement: ${name}\nData Points:\n`;
    limitedSeries.forEach(p => {
      prompt += `- Time: ${p.t.toISOString()}, Value: ${p.v}\n`;
    });
    prompt += '\n';
  });
  prompt += 'Summary:';

  const generatedText = await aiTextGenerator(prompt);
  console.log('AI Generated Summary:', generatedText.data);
  setAiSummary(generatedText.data.response);
  setAiLoading(false);
};

const AreaClient = ({ onBack }) => {
  const [tokenPresent, setTokenPresent] = useState(false); // New state to check if token is present
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [startInput, setStartInput] = useState('');
  const [stopInput, setStopInput] = useState('');
  const [aiSummary, setAiSummary] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);



  
 
// If token is present, continue with the rest of the AreaClient component logic

  useEffect(() => {
      const token = localStorage.getItem('token');
      console.log('Token presence check in AreaClient:', token);
      let mounted = true;
       if (token) {
          setTokenPresent(true);
        } else {
          setTokenPresent(false);
        }
      const load = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await retrieveClientData();
          console.log('Client Data on load:', data);
          if (mounted) setResponseData(data);
        } catch (err) {
          console.error(err);
          if (mounted) setError(err);
        } finally {
          if (mounted) setLoading(false);
        }
      };
      load();
      return () => { mounted = false; };
  }, []);
  

  

  const seriesByMeasurement = {};

  // Normalize backend response into flat points: [{ _measurement, _time, _value }]
  const normalizeResponse = (data) => {
    if (!data) return [];

    // Case: array-of-arrays with header row e.g. [ ['time','temperature'], ['2026...Z', 26.5], ... ]
    if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0]) && typeof data[0][0] === 'string' && data[0][0].toLowerCase().includes('time')) {
      const header = data[0].map(h => String(h).toLowerCase());
      const timeIdx = 0;
      const valueIdx = header.findIndex((h, i) => i !== timeIdx && h !== 'time');
      const measurementName = header[valueIdx] ? header[valueIdx] : 'unknown';
      const pts = [];
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (!Array.isArray(row)) continue;
        pts.push({ _measurement: measurementName, _time: row[timeIdx], _value: row[valueIdx] });
      }
      return pts;
    }

    // Case: object where keys are measurement names and values are array-of-arrays
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      const pts = [];
      Object.keys(data).forEach(key => {
        const v = data[key];
        if (Array.isArray(v) && v.length > 0 && Array.isArray(v[0]) && typeof v[0][0] === 'string' && v[0][0].toLowerCase().includes('time')) {
          const header = v[0].map(h => String(h).toLowerCase());
          const valueIdx = header.findIndex((h, i) => i !== 0 && h !== 'time');
          for (let i = 1; i < v.length; i++) {
            const row = v[i];
            if (!Array.isArray(row)) continue;
            pts.push({ _measurement: key, _time: row[0], _value: row[valueIdx] });
          }
        }
      });
      if (pts.length) return pts;
    }

    // already array of points/objects
    if (Array.isArray(data)) {
      return data.flatMap(item => {
        if (!item || typeof item !== 'object') return [];
        const time = item._time ?? item.time ?? item.Time ?? item.timestamp ?? null;
        const value = item._value ?? item.value ?? item.Value ?? (item.fields && (item.fields.value ?? item.fields._value)) ?? null;
        const measurement = item._measurement ?? item.measurement ?? item.name ?? 'unknown';
        return [{ _measurement: measurement, _time: time, _value: value }];
      });
    }

    // InfluxDB-style: { results: [ { series: [ { name, columns, values } ] } ] }
    if (data.results && Array.isArray(data.results)) {
      const pts = [];
      data.results.forEach(res => {
        if (!res.series) return;
        res.series.forEach(s => {
          const name = s.name || (s.tags && s.tags.measurement) || 'unknown';
          const cols = s.columns || [];
          const idxTime = cols.findIndex(c => c && c.toLowerCase().includes('time'));
          const idxValue = cols.findIndex(c => c && c.toLowerCase().includes('value'));
          (s.values || []).forEach(vals => {
            const time = idxTime >= 0 ? vals[idxTime] : vals[0];
            const value = idxValue >= 0 ? vals[idxValue] : vals[1];
            pts.push({ _measurement: name, _time: time, _value: value });
          });
        });
      });
      return pts;
    }

    // Series at root
    if (data.series && Array.isArray(data.series)) {
      const pts = [];
      data.series.forEach(s => {
        const name = s.name || 'unknown';
        const cols = s.columns || [];
        const idxTime = cols.findIndex(c => c && c.toLowerCase().includes('time'));
        const idxValue = cols.findIndex(c => c && c.toLowerCase().includes('value'));
        (s.values || []).forEach(vals => {
          const time = idxTime >= 0 ? vals[idxTime] : vals[0];
          const value = idxValue >= 0 ? vals[idxValue] : vals[1];
          pts.push({ _measurement: name, _time: time, _value: value });
        });
      });
      return pts;
    }

    // Unknown format
    return [];
  };

  
  const normalized = normalizeResponse(responseData);

  normalized.forEach(item => { // remove gaps and data without a time associated with it
    const name = item._measurement || 'unknown';
    const t = item._time ? new Date(item._time) : null;
    const v = item._value !== undefined ? Number(item._value) : NaN;
    if (!t || Number.isNaN(v)) return;
    if (!seriesByMeasurement[name]) seriesByMeasurement[name] = [];
    seriesByMeasurement[name].push({ t, v });
  });

  Object.keys(seriesByMeasurement).forEach(name => {
    seriesByMeasurement[name].sort((a, b) => a.t - b.t);
  });
  console.log('Series by measurement:', seriesByMeasurement[0]);

  if (!tokenPresent) {
    console.log('No token present, rendering login prompt in AreaClient.');
    return (
      <div className="page-card areaclient-card">    
        <h2>Área do Cliente</h2>
        <p>Bem-vindo à área do cliente. Para acessar este conteúdo, você precisa logar primeiro.</p>
        <div className="page-actions">
          <button className="back-btn" onClick={onBack}>Voltar</button>
        </div>
      </div>
    );
  }else{
    return (
      <div className="page-card areaclient-card">    
        <h2>Área do Cliente</h2>
        <p>Bem-vindo à área do cliente. Aqui você pode ver suas informações, pedidos e suporte.</p>

        <div className="controls">
          <label>
            Start:
            <input
              type="datetime-local"
              value={startInput}
              onChange={(e) => setStartInput(e.target.value)}
              aria-label="Start date and time"
            />
          </label>
          <label>
            Stop:
            <input
              type="datetime-local"
              value={stopInput}
              onChange={(e) => setStopInput(e.target.value)}
              aria-label="Stop date and time"
            />
          </label>
          <div className="control-buttons">
            <button className="small-btn" onClick={async () => {
              // Search button: uses current start/stop inputs to query and update charts
              const start = startInput ? new Date(startInput) : undefined;
              const stop = stopInput ? new Date(stopInput) : undefined;
              setLoading(true);
              setError(null);
              try {
                const data = await retrieveClientData(start, stop);
                setResponseData(data);
                if (data.status === 401) {
                  alert('Unauthorized access. Please log in again.');
                  window.location.href = '/';
                }
              } catch (err) {
                console.error(err);
                setError(err);
              } finally {
                setLoading(false);
              }
            }}>Search</button>

            <button className="small-btn" onClick={async () => {
              // last hour preset
              const now = new Date();
              const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
              setStartInput(oneHourAgo.toISOString().slice(0,16));
              setStopInput(now.toISOString().slice(0,16));
              setLoading(true);
              setError(null);
              try {
                const data = await retrieveClientData(oneHourAgo, now);
                setResponseData(data);
              } catch (err) {
                console.error(err);
                setError(err);
              } finally {
                setLoading(false);
              }
            }}>Last hour</button>

            <button className="small-btn" onClick={async () => {
              // last day preset
              const now = new Date();
              const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
              setStartInput(oneDayAgo.toISOString().slice(0,16));
              setStopInput(now.toISOString().slice(0,16));
              setLoading(true);
              setError(null);
              try {
                const data = await retrieveClientData(oneDayAgo, now);
                setResponseData(data);
              } catch (err) {
                console.error(err);
                setError(err);
              } finally {
                setLoading(false);
              }
            }}>Last day</button>

            <button className="small-btn" onClick={() => {
              // clear
              setStartInput('');
              setStopInput('');
              setResponseData(null);
              setAiSummary(null);
              // reload default
              (async () => {
                setLoading(true);
                setError(null);
                try {
                  const data = await retrieveClientData();
                  console.log('Client Data:', data);
                  setResponseData(data);
                } catch (err) {
                  console.error(err);
                  setError(err);
                } finally {
                  setLoading(false);
                }
              })();
            }}>Reset</button>

            <button className="small-btn" onClick={() => {
            setLoading(false);
            populateAISummary(seriesByMeasurement, setAiSummary, setAiLoading);
            setAiLoading(false);

          }}>AI Summary</button>
          </div>
        </div>

        <div className="charts">
          {loading && <div className="loading" >Carregando dados...</div>}
          {error && <div className="error">Erro ao carregar dados</div>}

          {!loading && !error && Object.keys(seriesByMeasurement).length === 0 && (
            <div className="no-data">Nenhum dado disponível</div>
          )}

          {!loading && !error && Object.keys(seriesByMeasurement).map((name) => (
            <LineChart
              key={name}
              name={name}
              series={seriesByMeasurement[name]}
              color={measurementColors[name] || '#10b981'}
            />
          ))}
        </div>

        {aiSummary && (
          <div className="ai-summary">
            <h3>AI Summary</h3>
            <pre>{aiSummary}</pre>
          </div>
        )}

        <div className="page-actions">
          <button className="back-btn" onClick={onBack}>Voltar</button>
        </div>

        
      </div>
    );
  };
}

  



export default AreaClient;