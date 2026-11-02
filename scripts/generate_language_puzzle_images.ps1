Add-Type -AssemblyName PresentationCore, PresentationFramework, WindowsBase

$jsonPath = "C:\Projects\funtopia\scripts\language_puzzles_data.json"
$destDir = "C:\Projects\funtopia\public\assets\guess-who\manual_uploads\miscellaneous\guess_the_language"

if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Force -Path $destDir | Out-Null
    Write-Output "Created destination directory: $destDir"
}

$rawJson = [System.IO.File]::ReadAllText($jsonPath, [System.Text.Encoding]::UTF8)
$puzzles = $rawJson | ConvertFrom-Json

$width = 1000
$height = 750
$dpi = 96

$cardWidth = 800
$cardHeight = 480
$cardX = 100
$cardY = 135
$cornerRadius = 36

Write-Output "Loaded $($puzzles.Count) puzzles from JSON. Starting generation..."

$generatedCount = 0

foreach ($p in $puzzles) {
    $visual = New-Object System.Windows.Media.DrawingVisual
    $context = $visual.RenderOpen()

    # 1. Dark outer background #0c0e1a
    $bgBrush = New-Object System.Windows.Media.SolidColorBrush([System.Windows.Media.Color]::FromArgb(255, 12, 14, 26))
    $context.DrawRectangle($bgBrush, $null, (New-Object System.Windows.Rect(0, 0, $width, $height)))

    # 2. Main solid-colored rounded card
    $cardColor = [System.Windows.Media.Color]::FromArgb(255, [int]$p.r, [int]$p.g, [int]$p.b)
    $cardBrush = New-Object System.Windows.Media.SolidColorBrush($cardColor)
    $context.DrawRoundedRectangle($cardBrush, $null, (New-Object System.Windows.Rect($cardX, $cardY, $cardWidth, $cardHeight)), $cornerRadius, $cornerRadius)

    # 3. Text formatting & centering
    $fontSize = 105
    $typeface = New-Object System.Windows.Media.Typeface(
        (New-Object System.Windows.Media.FontFamily($p.font)),
        [System.Windows.FontStyles]::Normal,
        [System.Windows.FontWeights]::SemiBold,
        [System.Windows.FontStretches]::Normal
    )

    # Measure width and scale down if wide
    $testFormatted = New-Object System.Windows.Media.FormattedText(
        $p.greeting,
        [System.Globalization.CultureInfo]::InvariantCulture,
        [System.Windows.FlowDirection]::LeftToRight,
        $typeface,
        $fontSize,
        [System.Windows.Media.Brushes]::White,
        1.0
    )

    if ($testFormatted.Width > 660) {
        $fontSize = [Math]::Floor($fontSize * (660 / $testFormatted.Width))
    }

    $finalFormatted = New-Object System.Windows.Media.FormattedText(
        $p.greeting,
        [System.Globalization.CultureInfo]::InvariantCulture,
        [System.Windows.FlowDirection]::LeftToRight,
        $typeface,
        $fontSize,
        [System.Windows.Media.Brushes]::White,
        1.0
    )

    $textX = ($width / 2) - ($finalFormatted.Width / 2)
    $textY = ($height / 2) - ($finalFormatted.Height / 2)

    $context.DrawText($finalFormatted, (New-Object System.Windows.Point($textX, $textY)))
    $context.Close()

    # Render to Bitmap
    $rtb = New-Object System.Windows.Media.Imaging.RenderTargetBitmap($width, $height, $dpi, $dpi, [System.Windows.Media.PixelFormats]::Pbgra32)
    $rtb.Render($visual)

    $encoder = New-Object System.Windows.Media.Imaging.PngBitmapEncoder
    $encoder.Frames.Add([System.Windows.Media.Imaging.BitmapFrame]::Create($rtb))

    $outFilePath = Join-Path $destDir $p.filename
    $stream = [System.IO.File]::Create($outFilePath)
    $encoder.Save($stream)
    $stream.Close()

    $generatedCount++
    Write-Output "[$generatedCount/20] Generated: $($p.filename) -> '$($p.greeting)' ($($p.language))"
}

Write-Output "All $generatedCount images successfully generated at $destDir!"
