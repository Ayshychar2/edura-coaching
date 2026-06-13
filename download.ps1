$urls = @{
    "index.html" = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NDI1MGMwNGQ3MmUwNzc5OWVjYmIwMTBkNGQ2EgsSBxCXvODw2wYYAZIBJAoKcHJvamVjdF9pZBIWQhQxMTMxNTczNjQ3NjkyMDE4NTQ5OQ&filename=&opi=89354086"
    "contact.html" = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NDI1MDU2MmZiMTYwMzM4NWVhNmJiMjRkMGE5EgsSBxCXvODw2wYYAZIBJAoKcHJvamVjdF9pZBIWQhQxMTMxNTczNjQ3NjkyMDE4NTQ5OQ&filename=&opi=89354086"
    "courses.html" = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NDI1MDU1NDMzODEwNDMxMzA0OGZlMTdjMzQ1EgsSBxCXvODw2wYYAZIBJAoKcHJvamVjdF9pZBIWQhQxMTMxNTczNjQ3NjkyMDE4NTQ5OQ&filename=&opi=89354086"
    "instructors.html" = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1NDI1MDU3ODRmNzYwMzM4NWMyOWM5MTZmMjU3EgsSBxCXvODw2wYYAZIBJAoKcHJvamVjdF9pZBIWQhQxMTMxNTczNjQ3NjkyMDE4NTQ5OQ&filename=&opi=89354086"
    "platform.html" = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzVjYWU4MmIxZTU0NTRmZmZiZTQ0MWQwMWNmOGQ0ZGY4EgsSBxCXvODw2wYYAZIBJAoKcHJvamVjdF9pZBIWQhQxMTMxNTczNjQ3NjkyMDE4NTQ5OQ&filename=&opi=89354086"
}

foreach ($file in $urls.Keys) {
    $url = $urls[$file]
    Write-Host "Downloading $file..."
    Invoke-WebRequest -Uri $url -OutFile $file
}
Write-Host "All downloads complete!"
