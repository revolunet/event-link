# Contracts: Share URL Buttons

**Feature**: 002-share-url-buttons

## API Contracts

This feature does not require any API contracts.

**Reason**: Event Link is a client-side only application. All data is encoded in URLs and processed in the browser. There are no server-side endpoints.

## URL Contract

The shareable URL uses hash fragments (not sent to server, ideal for client-side routing):

```
{base_url}#share=1&title={title}&start={start}&end={end}[&desc={description}][&url={url}]
```

### Parameters

| Parameter | Type | Required | Format |
|-----------|------|----------|--------|
| `share` | string | Yes | Must be `"1"` |
| `title` | string | Yes | URL-encoded text |
| `start` | string | Yes | ISO 8601 datetime (`YYYY-MM-DDTHH:mm`) |
| `end` | string | Yes | ISO 8601 datetime (`YYYY-MM-DDTHH:mm`) |
| `desc` | string | No | URL-encoded text |
| `url` | string | No | URL-encoded URL |

### Example

```
https://eventlink.app/#share=1&title=Team%20Meeting&start=2026-01-15T10:00&end=2026-01-15T11:00&desc=Discuss%20project%20updates
```

### Constraints

- Maximum URL length: 2000 characters
- If URL would exceed 1800 characters, description is truncated
