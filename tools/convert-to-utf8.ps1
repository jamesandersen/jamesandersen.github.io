foreach ($i in ls -name $pwd\*.markdown)
{
    $file_content = Get-Content "$pwd\$i";
    [System.IO.File]::WriteAllLines("$pwd\$i", $file_content);
}