<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Projected Data</title>
</head>
<body>
    <h1>Projected Data</h1>
    <table>
        <thead>
            <tr>
                <th>Column 1</th>
                <th>Column 2</th>
                <th>Column 3</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($data as $item)
                <tr>
                    <td>{{ $item->column1 }}</td>
                    <td>{{ $item->column2 }}</td>
                    <td>{{ $item->column3 }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
