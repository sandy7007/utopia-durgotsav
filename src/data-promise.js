import { serverEndPoint } from "./constant";

export const getTraceceptionUsage = async () => {
  try {
    const response = await fetch(`${serverEndPoint}getTraceceptionUsageCount`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching Traceception usage:', error);
    throw error;
  }
}

export const getTraceceptionLikeCount = async () => {
  try {
    const response = await fetch(`${serverEndPoint}getTraceceptionLikeCount`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching Traceception like count:', error);
    throw error;
  }
}

export const getSummarixUsageCount = async () => {
  try {
    const response = await fetch(`${serverEndPoint}getSummarixUsageCount`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching Summarix usage count:', error);
    throw error;
  }
}

export const getSummarixLikeCount = async () => {
  try {
    const response = await fetch(`${serverEndPoint}getSummarixLikeCount`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching Summarix like count:', error);
    throw error;
  }
}

export const getSummarixUser = async () => {
  try {
    const response = await fetch(`${serverEndPoint}getSummarixUser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching Summarix user:', error);
    throw error;
  }
}

export const getTraceceptionUser = async () => {
  try {
    const response = await fetch(`${serverEndPoint}getTraceceptionUser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching Traceception user:', error);
    throw error;
  }
}

export const getCopycurlButtonHitCount = async () => {
  try {
    const response = await fetch(`${serverEndPoint}getcopycurlcount`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching copycurl button hit count:', error);
    throw error;
  }
}