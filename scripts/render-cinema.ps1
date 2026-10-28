$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
$source = Join-Path $projectRoot 'public/assets/buddy.png'
$outputDirectory = Join-Path $projectRoot 'public/assets/cinema'
New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null
$video = Join-Path $outputDirectory 'buddy-scroll.mp4'
$poster = Join-Path $outputDirectory 'buddy-poster.jpg'

# Continuous camera push, rendered natively at 60 fps from the existing mascot.
# No generated transition, duplicate character, text baked into footage or paid call.
$filter = "color=c=0x0b0b0c:s=3840x2160:r=60:d=5[bg];[0:v]scale=1400:1400:flags=lanczos,format=rgba[robot];[bg][robot]overlay=x=2350:y=370:shortest=1,zoompan=z='1+1.3*(3*pow(on/299,2)-2*pow(on/299,3))':x='(iw-iw/zoom)*0.92':y='(ih-ih/zoom)*0.14':d=1:s=1920x1080:fps=60,format=yuv420p[out]"
& ffmpeg -hide_banner -loglevel error -y -loop 1 -framerate 60 -i $source -filter_complex $filter -map '[out]' -frames:v 300 -c:v libx264 -crf 19 -preset medium -x264-params 'keyint=1:min-keyint=1:scenecut=0' -g 1 -pix_fmt yuv420p -movflags '+faststart' -an $video
if ($LASTEXITCODE -ne 0) { throw 'Falha ao renderizar o vídeo cinematográfico.' }
& ffmpeg -hide_banner -loglevel error -y -i $video -frames:v 1 -q:v 2 $poster
if ($LASTEXITCODE -ne 0) { throw 'Falha ao extrair o poster.' }
& ffprobe -v error -select_streams v:0 -count_frames -show_entries stream=width,height,r_frame_rate,nb_read_frames -of json $video
Get-Item -LiteralPath $video | Select-Object Name,Length
